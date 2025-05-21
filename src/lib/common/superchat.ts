import moment from 'moment/moment'
import { renderContentforSC } from './content-render'
import { createMedal } from './medal'
import { SuperChat } from './superchatInterface'
import { SuperChatMessage } from '../messages'

// Create Superchat HTML entry for display
export async function createSuperchatEntry(
  sc: SuperChatMessage,
  removable: boolean
): Promise<HTMLElement> {
  const level = getSuperChatLevel(sc.price)
  const scEntry = document.createElement('div')
  scEntry.classList.add('sc-entry')
  
  // 移除了右键删除功能
  // scEntry.oncontextmenu = (e) => {
  //   e.preventDefault()
  //   const menu = document.createElement('div')
  //   menu.style.position = 'absolute'
  //   menu.style.left = `${e.clientX}px`
  //   menu.style.top = `${e.clientY}px`
  //   menu.style.backgroundColor = 'white'
  //   menu.style.border = '1px solid #ccc'
  //   menu.style.padding = '5px 0'
  //   menu.style.zIndex = '1000'
  //   const deleteOption = document.createElement('div')
  //   deleteOption.style.padding = '5px 15px'
  //   deleteOption.style.cursor = 'pointer'
  //   deleteOption.innerText = '删除'
  //   deleteOption.onclick = () => {
  //     scEntry.remove()
  //     window.jliverAPI.backend.removeGiftEntry('superchat', sc.id)
  //     menu.remove()
  //   }

  //   menu.appendChild(deleteOption)
  //   document.body.appendChild(menu)
    
  //   // 点击其他地方关闭菜单
  //   const closeMenu = () => {
  //     menu.remove()
  //     document.removeEventListener('click', closeMenu)
  //   }
  //   document.addEventListener('click', closeMenu)
  // }
  const scEntryHeader = document.createElement('div')
  scEntryHeader.classList.add('sc-entry-header')
  scEntryHeader.style.border = `1px solid var(--sc-f-level-${level})`
  scEntryHeader.style.backgroundColor = `var(--sc-b-level-${level})`
  const scEntryHeaderLeft = document.createElement('div')
  scEntryHeaderLeft.classList.add('sc-entry-header-left')
  const scEntryHeaderLeftAvatar = document.createElement('div')
  scEntryHeaderLeftAvatar.classList.add('sc-entry-header-left-avatar')
  const scEntryHeaderLeftAvatarImg = document.createElement('img')
  scEntryHeaderLeftAvatarImg.classList.add('avatar')
  scEntryHeaderLeftAvatarImg.src = sc.sender.face
  scEntryHeaderLeftAvatar.appendChild(scEntryHeaderLeftAvatarImg)
  scEntryHeaderLeft.appendChild(scEntryHeaderLeftAvatar)
  const scEntryHeaderLeftName = document.createElement('div')
  scEntryHeaderLeftName.classList.add('sc-entry-header-left-name')
  if (sc.sender.medal_info && sc.sender.medal_info.is_lighted) {
    const scEntryHeaderLeftNameMedal = createMedal(sc.sender.medal_info)
    scEntryHeaderLeftName.appendChild(scEntryHeaderLeftNameMedal)
  }
  const scEntryHeaderLeftNameSender = document.createElement('div')
  scEntryHeaderLeftNameSender.classList.add('sender')
  scEntryHeaderLeftNameSender.innerText = sc.sender.uname
  scEntryHeaderLeftName.appendChild(scEntryHeaderLeftNameSender)
  scEntryHeaderLeft.appendChild(scEntryHeaderLeftName)
  scEntryHeader.appendChild(scEntryHeaderLeft)
  const scEntryHeaderRight = document.createElement('div')
  scEntryHeaderRight.classList.add('sc-entry-header-right')
  scEntryHeaderRight.innerText = '￥' + sc.price
  scEntryHeader.appendChild(scEntryHeaderRight)
  scEntry.appendChild(scEntryHeader)
  const scEntryContent = document.createElement('div')
  scEntryContent.classList.add('sc-entry-content')
  scEntryContent.style.backgroundColor = `var(--sc-f-level-${level})`
  const scEntryContentText = document.createElement('div')
  scEntryContentText.classList.add('sc-entry-content-text')
  scEntryContentText.appendChild(await renderContentforSC(sc.message))
  scEntryContent.appendChild(scEntryContentText)
  //加灰色遮罩
  const scEntryOverlay = document.createElement('div')
  scEntryOverlay.classList.add('sc-entry-overlay')
  scEntryOverlay.style.position = 'absolute'
  scEntryOverlay.style.top = '0'
  scEntryOverlay.style.left = '0'
  scEntryOverlay.style.width = '100%'
  scEntryOverlay.style.height = '100%'
  scEntryOverlay.style.pointerEvents = 'none'
  scEntryOverlay.style.display = 'none'
  scEntryContent.appendChild(scEntryOverlay)
  // 添加右键菜单复制功能
  scEntry.oncontextmenu = (e) => {
    e.preventDefault()
    // 先移除可能存在的旧菜单
    const oldMenu = document.querySelector('.sc-context-menu')
    if (oldMenu) oldMenu.remove()

    const menu = document.createElement('div')
    menu.className = 'sc-context-menu'  // 添加类名以便后续查找
    menu.style.position = 'absolute'
    menu.style.left = `${e.clientX}px`
    menu.style.top = `${e.clientY}px`
    menu.style.backgroundColor = '#fff'
    menu.style.border = '1px solid #ddd'
    menu.style.borderRadius = '4px'
    menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
    menu.style.padding = '8px 0'
    menu.style.minWidth = '120px'
    menu.style.zIndex = '1000'
    menu.style.display = 'flex'
    menu.style.flexDirection = 'column'

    const copyOption = document.createElement('div')
    copyOption.style.padding = '8px 16px'
    copyOption.style.cursor = 'pointer'
    copyOption.innerText = '复制内容'
    copyOption.onmouseenter = () => copyOption.style.backgroundColor = '#f5f5f5'
    copyOption.onmouseleave = () => copyOption.style.backgroundColor = 'transparent'
    copyOption.onclick = () => {
        navigator.clipboard.writeText(scEntryContentText.innerText)
        menu.remove()
    }

    const toggleReadOption = document.createElement('div')
    toggleReadOption.style.padding = '8px 16px'
    toggleReadOption.style.cursor = 'pointer'
    toggleReadOption.innerText = '标记已读/未读'
    toggleReadOption.onmouseenter = () => toggleReadOption.style.backgroundColor = '#f5f5f5'
    toggleReadOption.onmouseleave = () => toggleReadOption.style.backgroundColor = 'transparent'
    toggleReadOption.onclick = () => {
        if (scEntryOverlay.style.display === 'none') {
            scEntryOverlay.style.display = 'block'
            scEntryOverlay.style.backgroundColor = 'rgba(240, 240, 240, 0.8)'
        } else {
            scEntryOverlay.style.display = 'none'
        }
        menu.remove()
    }

    menu.appendChild(copyOption)
    menu.appendChild(toggleReadOption)
    document.body.appendChild(menu)
    
    const closeMenu = () => {
      menu.remove()
      document.removeEventListener('click', closeMenu)
    }
    document.addEventListener('click', closeMenu)
  }
  const scEntryContentTime = document.createElement('div')
  scEntryContentTime.classList.add('sc-entry-content-time')
  scEntryContentTime.innerText = moment(sc.timestamp * 1000).format(
    'YYYY/MM/DD HH:mm:ss'
  )
  scEntryContent.appendChild(scEntryContentTime)
  scEntry.appendChild(scEntryContent)
   //移除了双击删除功能
  // if (removable) {   
  //   scEntry.ondblclick = () => {
  //     scEntry.remove()
  //     window.jliverAPI.backend.removeGiftEntry('superchat', sc.id)
  //   }
  // }
  return scEntry
}

// Different Superchat amount with different style
function getSuperChatLevel(price: number): number {
  if (price >= 2000) {
    return 5
  } else if (price >= 1000) {
    return 4
  } else if (price >= 500) {
    return 3
  } else if (price >= 100) {
    return 2
  } else if (price >= 50) {
    return 1
  }
  return 0
}
