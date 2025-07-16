export default class Loading {
  private static loadingDom: HTMLDivElement | null = null;
  constructor() {}

  public static show(opacity: number = 0.8, zIndex: number = 999) {
    if (Loading.loadingDom) return;
    const div = document.createElement('div');
    div.innerHTML = `
           <div style="width:42px;height:42px">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="20" stroke="#3498db" stroke-width="5" fill="none" stroke-dasharray="31.4 31.4">
                        <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from="0 50 50" 
                        to="360 50 50" 
                        dur="1s" 
                        repeatCount="indefinite"/>
                    </circle>
                </svg>
           </div>
        `;
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.background = `rgba(122, 122, 122, ${opacity})`;
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.zIndex = zIndex.toString();
    Loading.loadingDom = div;
    document.body.appendChild(div);
  }
  public static close() {
    if (Loading.loadingDom && Loading.loadingDom.parentNode) {
      Loading.loadingDom.parentNode.removeChild(Loading.loadingDom);
      Loading.loadingDom = null;
    }
  }
}
