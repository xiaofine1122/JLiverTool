// 公共辅助函数
function createBvLink(segment: string): HTMLElement {
  const a = document.createElement('a');
  a.className = 'bv-link';
  const url = `https://www.bilibili.com/video/${segment}`;
  a.addEventListener('click', () => {
    window.jliverAPI.util.openUrl(url);
    a.style.color = '#551a8b';
  });
  a.style.color = '#1890ff';
  a.style.textDecoration = 'underline';
  a.style.cursor = 'pointer';
  a.innerText = segment;
  return a;
}

function createPlainText(segment: string): HTMLElement {
  const p = document.createElement('span');
  p.innerText = segment;
  return p;
}

function processSegments(contentString: string, callback?: (bv: string) => void): HTMLElement {
  const segments = contentString.split(/([bB][vV][0-9a-zA-Z]+)/);
  const node = document.createElement('span');
  node.className = 'content';

  for (const segment of segments) {
    if (segment.length === 0) continue;
    if (/([bB][vV][0-9a-zA-Z]+)/.test(segment)) {
      node.append(createBvLink(segment));
      callback?.(segment);
    } else {
      node.append(createPlainText(segment));
    }
  }
  return node;
}

export async function renderContentforSC(content_string: string): Promise<HTMLElement> {
  const bvArray: string[] = [];
  const node = processSegments(content_string, (bv) => bvArray.push(bv));
  
  if (bvArray.length > 0) {
    node.append(document.createElement('br'));
    node.append(document.createElement('span').innerText = ' ');
    for (const bv of bvArray) {
      try {
        const videoInfo = await window.jliverAPI.backend.getVideoInfo(bv);
        if (videoInfo?.data?.title && videoInfo.data.owner?.name) {
          const infoLink = createBvLink(bv);
          infoLink.className = 'video-info';
          infoLink.innerText = `${bv} - ${videoInfo.data.title} - ${videoInfo.data.owner.name}`;
          infoLink.style.marginLeft = '5px';
          node.append(document.createElement('br'), infoLink);
        }else{
          node.append(document.createElement('br'), createPlainText(`${bv} - 没有获取到视频信息`));
        }
      } catch (error) {
        node.append(document.createElement('br'), createPlainText(`无法获取视频信息: ${bv}`));
        console.error('获取视频信息失败:', error);
      }
    }
  }
  return node;
}

export function renderContent(content_string: string): HTMLElement {
  return processSegments(content_string)
}
