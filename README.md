https://lucky.18g.cool

<h1>一个简单的抽奖网页。</h1>

<ol>
  <li>支持中文和 English，自动根据浏览器语言识别，也可手动切换</li>
  <li>支持输入名单或导入 txt 名单，过个名字之间使用逗号或换行间隔。</li>
  <li>可以设置抽奖人数。</li>
  <li>根据窗口大小和中奖人数量自动调整显示大小。支持用户自定义中奖人显示缩放系数，范围 0.5 - 1.5，叠加在系统自动缩放系数上。</li>
  <li>默认滚动刷新速度 150 ms，抽奖人数小于 10 的时候 150 * 0.9，小于 5 的时候 150 * 0.7，小于 3 的时候 150 * 0.6。支持用户自定义滚动刷新速度系数，叠加在默认速度上。</li>
  <li>可以导出中奖人名单，并将已中奖人从奖池移除，以进行多轮轮抽奖。默认通过 txt 导出中奖名单，可禁用。支持导出中奖界面截图，默认为关闭。</li>
  <li>支持 URL 参数：例如 https://lucky.18g.cool?lang=zh&scale=1.2&speed=0.8&txt=n&png=y 代表设置语言为 English，显示缩放系数 1.2，刷新速度系数 0.8，不导出 txt，导出截图。</li>
  <ul>
    <li>lang: 语言参数，支持 zh 和 en</li>
    <li>scale: 显示缩放系数，范围 0.5 - 1.5</li>
    <li>speed: 刷新速度系数，范围 0.5 - 1.5</li>
    <li>txt: 是否导出 txt，y 为是，n 为否</li>
    <li>png: 是否截图，y 为是，n 为否</li>
  </ul>
</ol>


<h1>A Simple Lucky Draw Webpage</h1>

<ol>
  <li>Support Chinese and English, auto detect browser language, manually switch supported.</li>
  <li>Able to set candicates by impoting txt or just typing, seperate multiple candidate with comma and/or new line.</li>
  <li>Able to set number of winners.</li>
  <li>Able to auto adjust display size of winners acooding to the number of winners and the size of brower window. Allow user to customize scale factor between 0.5 - 1.5, this, scale factor would be based on default scale factor.</li>
  <li>The default refresh time is 150 ms if more than 10 winners, 150 ms * 0.9 if less than 10, 150 ms * 0.7 if less than 5, 150 ms * 0.6 if less than 3. Allow user to customize speed factor between 0.5 - 1.5, speed factor would be based on defult time.</li>
  <li>Able to export winner list, and remove winners from pool for multiple rounds support. export list to a txt file by default, txt export could be disabled, able to export as screenshot, screenshot is disabled by default.</li>
  <li>Suppot URL parameters: eg. https://lucky.18g.cool?lang=en&scale=1.2&speed=0.8&txt=n&png=y means set language to English, Scale factor to 1.2, Speed factor to 0.8, disable txt export, enable screenshot export.</li>
  <ul>
    <li>lang: Lanuage, supporty en and zh</li>
    <li>scale: Scale factor, range 0.5 - 1.5</li>
    <li>speed: Speed factor, range 0.5 - 1.5</li>
    <li>txt: Whether export txt, y for Yes, n for No</li>
    <li>png: Whether export screenshot, y for Yes, n for No</li>
  </ul>
</ol>
