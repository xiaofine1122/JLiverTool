import Alpine from 'alpinejs'
import { createConfirmBox } from '../lib/common/confirmbox'
import { createSuperchatEntry } from '../lib/common/superchat'
import JEvent from '../lib/events'
import { WindowType } from '../lib/types'
import { JLiverAPI } from '../preload'
import { SuperChatMessage } from '../lib/messages'

let $panel = document.getElementById('panel')
let giftMap = new Map()

// let autoScroll = true
// let lastPosition = 0
// $panel.addEventListener('scroll', () => {
//   if (Math.ceil($panel.scrollTop) == lastPosition) {
//     // Auto scroll
//     autoScroll = true
//     return
//   }
//   // User scroll
//   autoScroll =
//     Math.ceil($panel.scrollTop)  >= $panel.scrollHeight - $panel.clientHeight - 10
    
// })

declare global {
  interface window {
    jliverAPI: JLiverAPI
  }
}

const app = {
  async init() {
    this.opacity = await window.jliverAPI.get('config.opacity', 1)
    this.theme = await window.jliverAPI.get('config.theme', 'light')
    this.font = await window.jliverAPI.get('config.font', 'system-ui')
    this.font_size = await window.jliverAPI.get('config.font_size', 14)
    window.jliverAPI.onDidChange('config.opacity', (newValue: number) => {
      this.opacity = newValue
    })
    window.jliverAPI.onDidChange('config.font_size', (newValue: number) => {
      this.font_size = newValue
    })
    window.jliverAPI.onDidChange('config.font', (newValue: string) => {
      this.font = newValue
    })
    document.documentElement.classList.add('theme-' + (this.theme || 'light'))
    window.jliverAPI.onDidChange('config.theme', (newValue: string) => {
      this.theme = newValue
    })
    await this.initSuperchats()
    window.jliverAPI.register(
      JEvent.EVENT_NEW_SUPER_CHAT,
      (sc: SuperChatMessage) => {
        this.superchatHandler(sc)
      }
    )
    window.jliverAPI.onDidChange('config.room', () => {
      // clear superchats when room changed
      $panel.innerHTML = ''
      giftMap = new Map()
      this.initSuperchats()
    })
    this.lite_mode = await window.jliverAPI.get('config.lite-mode', false)
    window.jliverAPI.onDidChange('config.lite-mode', (newValue: boolean) => {
      this.lite_mode = newValue
    })
  },
  opacity: 1,
  font: 'system-ui',
  font_size: 14,
  lite_mode: false,
  _theme: 'light',
  get theme() {
    return this._theme
  },
  set theme(newValue) {
    document.documentElement.classList.remove(
      'theme-' + (this._theme || 'light')
    )
    document.documentElement.classList.add('theme-' + (newValue || 'light'))
    this._theme = newValue
  },
  async initSuperchats() {
    let init_superchats = await window.jliverAPI.backend.getInitSuperChats()
    init_superchats.forEach((sc) => {
      this.superchatHandler(sc)
    })
  },
  notifyClear() {
    document.body.appendChild(
      createConfirmBox('确定清空所有醒目留言记录？', () => {
        $panel.innerHTML = ''
        giftMap = new Map()
        window.jliverAPI.backend.clearSuperChats()
      })
    )
  },
  exportSuperChat() {
    document.body.appendChild(
      createConfirmBox('确定要导出醒目留言数据？', async () => {
        try {
          // 获取所有SuperChat数据
          const scData = Array.from($panel.querySelectorAll('.sc-entry')).map(entry => ({
            user: entry.querySelector('.sender')?.textContent || '',
            price: entry.querySelector('.sc-entry-header-right')?.textContent || '',
            message: entry.querySelector('.sc-entry-content-text')?.textContent || '',
            time: entry.querySelector('.sc-entry-content-time')?.textContent || ''
          }));

          // 添加空数据判断
          if (!scData || scData.length === 0) {
            alert('当前没有可导出的醒目留言数据');
            return;
          }

          // 转换为CSV格式
          const csvContent = "data:text/csv;charset=utf-8," + "\uFEFF" + // 添加UTF-8 BOM头
            "用户,金额,留言内容,时间\n" 
            + scData.map(e => `"${e.user}","${e.price}","${e.message.replace(/"/g, '""')}","${e.time}"`).join("\n");
          
          // 创建下载链接
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `superchat_${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}.csv`);
         
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('导出失败:', error);
        }
      })
    )
  },
  async superchatHandler(sc: SuperChatMessage) {
    let scEntry = await createSuperchatEntry(sc, true)
    //改为从最上面添加，不滚动了
    $panel.insertBefore(scEntry, $panel.firstChild)
    // if (autoScroll) {
    //   // $panel.scrollTop = lastPosition =
    //   //   $panel.scrollHeight - $panel.clientHeight
    //   requestAnimationFrame(() => {
    //     $panel.scrollTop = $panel.scrollHeight;
    // });
    // }
  },
  hide() {
    window.jliverAPI.window.hide(WindowType.WSUPERCHAT)
  },
  // scPanel: {
  //   newScCount: 0,
  //   autoScroll: true,
  //   scrollRemain: 0,
  //   enableAutoScroll() {
  //     $panel.scrollTop = $panel.scrollHeight - $panel.clientHeight
  //     this.scrollRemain = 0
  //     this.newScCount = 0
  //     this.autoScroll = true
  //   },
  //   scrollHandler() {
  //     // User scroll
  //     if (
  //       Math.ceil($panel.scrollTop) >=
  //       $panel.scrollHeight - $panel.clientHeight - 10
  //     ) {
  //       this.autoScroll = true
  //       this.newScCount = 0
  //       this.scrollRemain = Math.ceil(
  //         $panel.scrollHeight -
  //           $panel.clientHeight -
  //           $panel.scrollTop
  //       )
  //     } else {
  //       this.autoScroll = false
  //     }
  //   },
  // },
}



Alpine.data('app', () => app)
Alpine.start()
