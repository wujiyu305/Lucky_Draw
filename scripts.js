let names = []
let winners = [];
let interval;
let speed = 150;     //默认滚动刷新速度 150 ms
let pngwaiting = 1;
let lang;
let color = 'green';
let string_setNameAlert;
let string_setNameAlert_tpye;
let string_setNameAlert_content;
let string_setNameAlert_left;
let string_setNameAlert_right;
let string_setNameAlert_oneName;
let string_setNameAlert_importFail;
let string_setNameAlert_typeFail;
let string_alert;
let string_nameAlert;
let string_startAlert_nonInt;
let string_winnerAlert_noName;
let string_winnerAlert_biggerWinner;
let string_winnerAlert_oneWinner;
let string_exportAlert;
let string_exportTemplate_p1;
let string_exportTemplate_p2;
let string_alertBtnLeft;
let string_alertBtnRight;
let string_cancel;
let string_continue;
listener();

function listener() {
    window.addEventListener('load', function() {

        /* 读取网址参数 */
        const urlPara = new URLSearchParams(window.location.search);
        if (urlPara.get('png') == 'y') {
            document.getElementById('png').checked = true;
        }
        if (urlPara.get('txt') == 'n') {
            document.getElementById('txt').checked = false;
        }
        if (urlPara.get('scale') >= 0.5 & urlPara.get('scale') <= 1.5 ) {
            document.getElementById('scale').value = urlPara.get('scale');
        }
        if (urlPara.get('speed') >= 0.5 & urlPara.get('speed') <= 1.5 ) {
            document.getElementById('speed').value = urlPara.get('speed');
        }

        /* 获取色彩参数并自动切换 */
        if (urlPara.get('color') == 'red' | urlPara.get('color') == 'green' | urlPara.get('color') == 'blue') {
            color = urlPara.get('color');
        }
        setColor(color);

        /* 获取浏览器语言, 并自动切换 */
        lang = navigator.language.substring(0, 2);
        if (urlPara.get('lang') == 'en' | urlPara.get('lang') == 'zh') {
            lang = urlPara.get('lang');
        }
        setLang(lang);
    
        /* 网页加载完后 3 秒延迟隐藏说明窗口 */
        setTimeout(function() {
            showInfo('hide');
        }, 3000);
    });
    document.addEventListener('keydown', handleKeyDown);

    document.getElementById('scale').addEventListener('input', function() {
        displayWinners();     // 调整大小滑块时缩放 winnerBox
    });
    window.addEventListener('resize', function() {
        displayWinners();     // 在窗口大小变化时缩放 winnerBox
    });
    /* 点击空白处关闭设置和信息窗口 */
    document.getElementById('overlay').addEventListener('click', function(){
        showInfo('hide');
        showSettings('hide');
    });
}

function handleKeyDown(event){
    if(event.key ==' ') {       //监听空格键来触发开始抽奖
        event.preventDefault();
        if (document.getElementById('stopBtn').style.display == 'none') {
            startDrawing();
        }
        else {
            stopDrawing();
        }
    }
}

function setLang(language) {
    switch (language) {
        case 'zh': {
            lang = 'zh';
            stringLoader();
            document.getElementById("btnChinese").disabled = true;
            document.getElementById("btnEnglish").disabled = false;
            break;
        }
        case 'en': {
            lang = 'en';
            stringLoader();
            document.getElementById("btnChinese").disabled = false;
            document.getElementById("btnEnglish").disabled = true;
            break;
        }
        default: {
            lang = 'zh';
            stringLoader();
            document.getElementById("btnChinese").disabled = true;
            document.getElementById("btnEnglish").disabled = false;
            break;
        }
    }
}

function setColor(colorTheme) {
    color = colorTheme;
    switch (color) {
        case 'red': {
            document.getElementById("red").classList.add('colorActive');
            document.getElementById("green").classList.remove('colorActive');
            document.getElementById("blue").classList.remove('colorActive');
            document.body.className = 'redBody';
            break;
        }
        case 'green': {
            document.getElementById("red").classList.remove('colorActive');
            document.getElementById("green").classList.add('colorActive');
            document.getElementById("blue").classList.remove('colorActive');
            document.body.className = 'greenBody';
            break;
        }
        case 'blue': {
            document.getElementById("red").classList.remove('colorActive');
            document.getElementById("green").classList.remove('colorActive');
            document.getElementById("blue").classList.add('colorActive');
            document.body.className = 'blueBody';
            break;
        }
    }
    pngwaiting = 1;
    displayWinners();
}

function stringLoader() {

    /* 多语言网页 String 设置区域 */
    /* zh */
    if (lang == 'zh') {
        document.title = "幸运抽奖";
        document.getElementById('infoBotton').title = "使用说明";
        document.getElementById('infoTitle').innerText = "使用说明";
        document.getElementById('infoContent').innerHTML = "<li><p>首先请使用“设置名单”设置候选名单，支持导入 txt 文本文件，文件中可使用换行或者逗号来间隔多个候选人。若有重复名字，会自动去重。</p></li><li><p>成功名单成功后，名单按钮自动显示名单的总人数，点击按钮显示详细名单。</p></li><li><p>然后请设置本轮抽奖数量，请设置得低于总人数。</p></li><li><p>点击“开始”以开始抽奖，屏幕上会滚动随机显示对应数量的中奖人。点击“停止”以停止滚动，此时中奖人固定不再变化，视为中奖。</p></li><li><p>支持使用键盘上的空格键触发开始/停止。</p></li><li><p>使用“导出并移除”导出一个以当前时间为文件名的 txt 文件，包含当前中奖的名单和尚未中奖的名单，同时会将已经中奖的名单从总名单中移除，避免重复中奖。</p></li>";
        document.getElementById('settingsBotton').title = "设置";
        document.getElementById('settingsTitle').innerText = "设置";
        document.getElementById('theme').innerText = "主题";
        document.getElementById('winnerSize').innerText = "中奖人显示大小";
        document.getElementById('winnerSpeed').innerText = "中奖人滚动速度";
        document.getElementById('expTXT').innerText = "导出 TXT 文本";
        document.getElementById('expPNG').innerText = "导出 PNG 截图";
        document.getElementById('startBtn').innerText = "开始";
        document.getElementById('startBtn').title = "设置名单后，点击开始按钮或者按下键盘空格键以开始抽奖，屏幕上会滚动随机显示对应数量的中奖人。";
        document.getElementById('stopBtn').innerText = "停止";
        document.getElementById('stopBtn').title = "点击停止按钮或者按下键盘空格键以停止，中奖人固定不再变化，视为中奖。";
        document.getElementById('numInput').title = "设置本轮抽奖的中奖人数量，请设置得低于总人数。";
        document.getElementById('setBtn').innerText = "设置名单";
        document.getElementById('setBtn').title = "支持导入 txt 纯文本文件，请在 txt 中通过换行或者逗号来间隔多个候选人名字，不要出现重复的名字。如果人数较少，也可以输入名单。";
        document.getElementById('nameBtn').title = "显示当前奖池的名单。";
        document.getElementById('removeBtn').innerText = "导出并移除";
        document.getElementById('removeBtn').title = "导出一个以当前时间为文件名的 txt 文档，其中包含当前中奖的名单和尚未中奖的名单，同时将已经中奖的名单从总名单中移除，避免重复中奖。";
        string_setNameAlert = "请选择设置名单的方式";
        string_setNameAlert_tpye = "请输入名单";
        string_setNameAlert_content= "用逗号和换行来分隔多个名字";
        string_setNameAlert_left = "输入名单";
        string_setNameAlert_right = "导入 TXT 名单";
        string_setNameAlert_oneName = "1 个人就不用抽奖了吧。";
        string_setNameAlert_importFail = "导入失败，请检查 txt 文件。";
        string_setNameAlert_typeFail = "检测失败，请重新输入。";
        string_alert = '提醒';
        string_nameAlert = "当前奖池中名单：";
        string_startAlert_nonInt = "请确保在中奖人数处仅输入了整数哦。";
        string_winnerAlert_noName = "抽奖名单现在是空的哦。";
        string_winnerAlert_biggerWinner = "请设置比总人数少的中奖人数。";
        string_winnerAlert_oneWinner = "请设置大于 1 的中奖人数。";
        string_exportAlert = "这一轮还没有人中奖哦。";
        string_exportTemplate_p1 = "********** 当轮中奖 **********\n\n";
        string_exportTemplate_p2 = "\n\n****************************\n\n\n\n\n\n\n\n\n********** 尚未中奖 **********\n\n";
        string_alertBtnLeft = "使用说明";
        string_alertBtnRight = "确定";
        string_cancel = '取消';
        string_continue = '继续';
    }

    /* en */
    else if (lang == 'en') {
        document.title = "Lucky Draw";
        document.getElementById('infoBotton').title = "Instruction";
        document.getElementById('infoTitle').innerText = "Instruction";
        document.getElementById('infoContent').innerHTML = "<li><p>Hit \"Set List\" to set candidates, you can import candidates from a txt file, seperate multiple names with comma or new line. Duplicated names would be auto-removed.</p></li><li><p>The number of total candidates would show on the button after list set.</p></li><li><p>Then please set the number of winners for this round.</p></li><li><p>Hit \"Start\", winner names would appear on screen and change quickly. Hit \"Stop\", name would stop changing and these names are winners.</p></li><li><p>You can use the Space key on keyboard to Start/Stop.</p></li><li><p>Use \"Exp & Rem\" (Export & Remove) to export a txt file names under current time, which contains winners for this round and non-winner names. And winners would be removed to prevent them from being winner again for next round.</p></li>";
        document.getElementById('settingsBotton').title = "Settings";
        document.getElementById('settingsTitle').innerText = "Settings";
        document.getElementById('theme').innerText = "Theme";
        document.getElementById('winnerSize').innerText = "Winner Box Size";
        document.getElementById('winnerSpeed').innerText = "Refresh Speed";
        document.getElementById('expTXT').innerText = "Export TXT File";
        document.getElementById('expPNG').innerText = "Export Screenshot";
        document.getElementById('startBtn').innerText = "Start";
        document.getElementById('startBtn').title = "Hit \"Start\" or Space key, winner names would appear on screen and change quickly.";
        document.getElementById('stopBtn').innerText = "Stop";
        document.getElementById('stopBtn').title = "Hit \"Stop\" or Space key, name would stop changing and these names are winners.";;
        document.getElementById('numInput').title = "Number of winners this this round. Should be less than number of total candidates.";
        document.getElementById('setBtn').innerText = "Set List";
        document.getElementById('setBtn').title = "Import candidate names from txt file, seperate miltiple names with comma or new line. You can also use type names for small list.";
        document.getElementById('nameBtn').title = "Show all the candicates.";
        document.getElementById('removeBtn').innerText = "Exp & Rem";
        document.getElementById('removeBtn').title = "Export a txt file names under current time, which contains winners for this round and non-winner names. And winners would be removed to prevent them from being winner again for next round.";
        string_setNameAlert = "Set Name List";
        string_setNameAlert_tpye = "Please Type Name List";
        string_setNameAlert_content= "Seperate multiple names with comma or new line.";
        string_setNameAlert_left = "Type Names";
        string_setNameAlert_right = "TXT Import Names";
        string_setNameAlert_oneName = "You don't need a luck draw if you got only 1 candidate.";
        string_setNameAlert_importFail = "Failed to set candidates from txt, please check the file.";
        string_setNameAlert_typeFail = "Failed to detect candidates, please check and try again.";
        string_alert = 'Reminder';
        string_nameAlert = "Candidates for Now:";
        string_startAlert_nonInt = "Please make sure to enter only integers for the number of winners.";
        string_winnerAlert_noName = "Candidate list is still empty.";
        string_winnerAlert_biggerWinner = "Winners should be less than candidates.";
        string_winnerAlert_oneWinner = "Please allow at least 1 winner";
        string_exportAlert = "There is no winner for this round yet.";
        string_exportTemplate_p1 = "****** Winners for this round *******\n\n";
        string_exportTemplate_p2 = "\n\n*************************************\n\n\n\n\n\n\n\n\n********** Candidates left **********\n\n";
        string_alertBtnLeft = "Instruction";
        string_alertBtnRight = "OK";
        string_cancel = 'Cancel';
        string_continue = 'Continue';
    }
}

function showInfo(showorhide) {
    const info = document.getElementById('info');
    const settings = document.getElementById('settings');
    const alert = document.getElementById('alert');
    if (showorhide == 'show'){
        info.style.transform = 'scale(1)';
        settings.style.transform = 'scale(0)';
        showAlert();
        showOverlay();
        return
    }
    if (showorhide == 'hide'){
        info.style.transform = 'scale(0)';
        showOverlay();
        return
    }
    info.style.transform = info.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
    settings.style.transform = 'scale(0)';
    showAlert();
    showOverlay();
}

function showSettings(showorhide) {
    const info = document.getElementById('info');
    const settings = document.getElementById('settings');
    if (showorhide == 'show'){
        info.style.transform = 'scale(0)';
        settings.style.transform = 'scale(1)';
        showAlert();
        showOverlay();
        return
    }
    if (showorhide == 'hide'){
        settings.style.transform = 'scale(0)';
        showOverlay();
        return
    }
    settings.style.transform = settings.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
    info.style.transform = 'scale(0)';
    showAlert();
    showOverlay();
}

function showOverlay() {
    const info = document.getElementById('info');
    const settings = document.getElementById('settings');
    const alert = document.getElementById('alert');
    const overlay = document.getElementById('overlay');
    if (info.style.transform == 'scale(1)' | settings.style.transform == 'scale(1)' | alert.style.transform == 'scale(1)') {
        overlay.style.display = 'block';
        document.removeEventListener('keydown', handleKeyDown);
    }
    else {
        overlay.style.display = 'none';
        document.addEventListener('keydown', handleKeyDown);
    }
}


function showAlert(alerttitle, alerttext) {
    const alert = document.getElementById('alert');
    if (alerttext){
        if (alert.children.length ){
            while (alert.firstChild) {
                alert.removeChild(alert.firstChild);
            }
        }
        const alertTitle = document.createElement('h1');
        alertTitle.id = 'alertTitle';
        alertTitle.innerText = alerttitle;
        alert.appendChild(alertTitle);
        const alertContent = document.createElement('p');
        alertContent.id = 'alertContent';
        alertContent.innerText = alerttext;
        alert.appendChild(alertContent);
        const buttonSepH = document.createElement('p');
        buttonSepH.id = 'buttonSepH';
        alert.appendChild(buttonSepH);
        const alertLeftBtn = document.createElement('button');
        alertLeftBtn.id = 'alertLeftBtn';
        alertLeftBtn.innerText = string_alertBtnLeft;
        alertLeftBtn.setAttribute('onclick', 'showInfo()');
        alert.appendChild(alertLeftBtn);
        const buttonSepV = document.createElement('p');
        buttonSepV.id = 'buttonSepV';
        alert.appendChild(buttonSepV);
        const alertRightBtn = document.createElement('button');
        alertRightBtn.setAttribute('onclick', 'showAlert()');
        alertRightBtn.id = 'alertRightBtn';
        alertRightBtn.innerText = string_alertBtnRight;
        alert.appendChild(alertRightBtn);
        alert.style.transform = 'scale(1)';
        alert.classList.add('blur');
        showOverlay();
    }
    else {
        alert.style.transform = 'scale(0)';
        setTimeout (function(){
            while (alert.firstChild) {
                alert.removeChild(alert.firstChild);
            }
        }, 300)
        alert.classList.remove('blur');
        showOverlay();
    }
}

function setNameAlert () {
    const alert = document.getElementById('alert');
    if (alert.children.length ){
        while (alert.firstChild) {
            alert.removeChild(alert.firstChild);
        }
    }
    const alertTitle = document.createElement('h1');
    alertTitle.id = 'alertTitle';
    alertTitle.innerText = string_setNameAlert;
    alert.appendChild(alertTitle);
    const alertContent = document.createElement('p');
    alertContent.id = 'alertContent';
    alertContent.innerText = string_setNameAlert_content;
    alert.appendChild(alertContent);
    const buttonSepH = document.createElement('p');
    buttonSepH.id = 'buttonSepH';
    alert.appendChild(buttonSepH);
    const alertLeftBtn = document.createElement('button');
    alertLeftBtn.id = 'alertLeftBtn';
    alertLeftBtn.innerText = string_setNameAlert_left;
    alertLeftBtn.setAttribute('onclick', 'typeNameAlert()');
    alert.appendChild(alertLeftBtn);
    const buttonSepV = document.createElement('p');
    buttonSepV.id = 'buttonSepV';
    alert.appendChild(buttonSepV);
    const alertRightBtn = document.createElement('button');
    alertRightBtn.setAttribute('onclick', 'setNames(1)');
    alertRightBtn.id = 'alertRightBtn';
    alertRightBtn.innerText = string_setNameAlert_right;
    alert.appendChild(alertRightBtn);
    alert.style.transform = 'scale(1)';
    alert.classList.add('blur');
    showOverlay();
}

function typeNameAlert () {
    const alert = document.getElementById('alert');
    if (alert.children.length ){
        while (alert.firstChild) {
            alert.removeChild(alert.firstChild);
        }
    }
    const alertTitle = document.createElement('h1');
    alertTitle.id = 'alertTitle';
    alertTitle.innerText = string_setNameAlert_tpye;
    alert.appendChild(alertTitle);
    const alertContent = document.createElement('p');
    alertContent.id = 'alertContent';
    alertContent.innerText = string_setNameAlert_content;
    alert.appendChild(alertContent);
    const alertTextarea = document.createElement('textarea');
    alertTextarea.id = 'typelist';
    alert.appendChild(alertTextarea);
    const buttonSepH = document.createElement('p');
    buttonSepH.id = 'buttonSepH';
    alert.appendChild(buttonSepH);
    const alertLeftBtn = document.createElement('button');
    alertLeftBtn.id = 'alertLeftBtn';
    alertLeftBtn.innerText = string_cancel;
    alertLeftBtn.setAttribute('onclick', 'showAlert()');
    alert.appendChild(alertLeftBtn);
    const buttonSepV = document.createElement('p');
    buttonSepV.id = 'buttonSepV';
    alert.appendChild(buttonSepV);
    const alertRightBtn = document.createElement('button');
    alertRightBtn.setAttribute('onclick', 'setNames()');
    alertRightBtn.id = 'alertRightBtn';
    alertRightBtn.innerText = string_continue;
    alert.appendChild(alertRightBtn);
    alert.style.transform = 'scale(1)';
    alert.classList.add('blur');
    showOverlay();
}


function setNames(setname) {    //设置名单
    showAlert();
    if (setname) {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const contents = event.target.result;
                names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');    //支持中英文逗号及换行间隔
                names = Array.from(new Set(names));    //去除重复值
                if (names.length > 1) {
                    document.getElementById('nameBtn').innerHTML = names.length;    //更新总人数
                    document.getElementById('setBtn').style.display = "none";
                    document.getElementById('nameBtn').style.display = "";
                }
                else if (names.length == 1) {
                    showAlert(string_alert, string_setNameAlert_oneName);
                }
                else {
                    showAlert(string_alert, string_setNameAlert_importFail);
                }
            };
        reader.readAsText(file);
    });
    fileInput.click();
    }
    else {
        const contents = document.getElementById('typelist').value;
        showAlert();
        names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');    //支持中英文逗号及换行间隔
        names = Array.from(new Set(names));    //去除重复值
        if (names.length > 1) {
            document.getElementById('nameBtn').innerHTML = names.length;    //更新总人数
            document.getElementById('setBtn').style.display = "none";
            document.getElementById('nameBtn').style.display = "";
        }
        else if (names.length == 1) {
            showAlert(string_alert, string_setNameAlert_oneName);
        }
        else {
            showAlert(string_alert, string_setNameAlert_typeFail);
        }
    }
}

function showNames() {
    const allNames = names.join('\n');
    showAlert(string_nameAlert, allNames);
}

function startDrawing() {    //开始抽奖
    const numInput = document.getElementById('numInput');
    const numWinners = parseInt(numInput.value);    //获取设置的中奖人数并 Int 化

    if (numWinners != numInput.value){    //输入的中奖人数与 Int 化后的人数不一致，说明输入的不是整数
        showAlert(string_alert, string_startAlert_nonInt);
        return;
    }
    
    if (names.length == 0) {    //尚未设置名单的时候开始抽奖，则显示网页说明。
        showAlert(string_alert, string_winnerAlert_noName,);
        return;
    }
    
    if (numWinners >= names.length) {    //中奖人数比总人数高或相同
        showAlert(string_alert, string_winnerAlert_biggerWinner);
        return;
    }
    
    if (numWinners <= 0) {    //中奖人数不是正数
        showAlert(string_alert, string_winnerAlert_oneWinner);
        return;
    }
    
    showInfo('hide');
    showSettings('hide');
    document.getElementById('startBtn').style.display = "none";
    document.getElementById('stopBtn').style.display = "";
    document.getElementById('nameBtn').style.display = "";
    document.getElementById('removeBtn').style.display = "none";
    document.getElementById('nameBtn').disabled = true;    //开始抽奖时禁用名单按钮

    let userspeed = document.getElementById('speed').value;       //获取用户设置的速度系数
    interval = setInterval(function() {
        winners = [];    //清空中奖
        
        while (winners.length < numWinners) {
            const randomIndex = Math.floor(Math.random() * names.length);    //取随机数
            const winner = names[randomIndex];
            
            if (!winners.includes(winner)) {
                winners.push(winner);      //不能出现重复的名字
            }
        }
        
        displayWinners();
        userspeed = document.getElementById('speed').value;
        clearInterval(interval);     // 清除当前定时器
        interval = setInterval(arguments.callee, (speed / userspeed));     // 以动态获取用户设置的速度
    }, (speed / userspeed));
}


function displayWinners() {     //显示中奖人
    const winnersDiv = document.getElementById('winners');
    winnersDiv.innerHTML = '';

    for (eachWinner of winners) {     // DIV 中逐一插入奖人的名字
        const winnerBox = document.createElement('div');
        winnerBox.classList.add('winnerBox');
        winnerBox.classList.add('blur');
        winnerBox.classList.add(color+'Winner');
        let scaleFactor = Math.sqrt((window.innerWidth * window.innerHeight) / (1440 * 800));   // 以 1440 * 800 的窗口大小为基准按比例缩放
        scaleFactor = scaleFactor * Math.pow(3 / (names.reduce((acc, name) => acc + name.length, 0) / names.length), 0.25);   // 以平均每个名字 3 个字符为基准按比例缩放
        scaleFactor = scaleFactor * document.getElementById('scale').value;        //引入用户设置的缩放系数
        if (winners.length >= 10) {
            speed = 150;
            scaleFactor = scaleFactor * Math.pow((10 / winners.length), 0.4);    // 以 10 人中奖的的 Box 大小为基准按比例缩放
            winnerBox.style.fontSize = 64 * scaleFactor +'px';
            winnerBox.style.margin = 20 * scaleFactor +'px';
            winnerBox.style.borderRadius = 20 * scaleFactor +'px';
            winnerBox.style.padding = 10 * Math.pow(scaleFactor, 0.4) +'px ' + 40 * scaleFactor +'px';
        }
        else if (winners.length >= 5) {
            speed = 150 * 0.9;
            winnerBox.style.fontSize = 68 * scaleFactor +'px';
            winnerBox.style.margin = 22 * scaleFactor +'px';
            winnerBox.style.borderRadius = 22 * scaleFactor +'px';
        }
        else if (winners.length >= 3) {
            speed = 150 * 0.7;
            winnerBox.style.fontSize = 72 * scaleFactor +'px';
            winnerBox.style.margin = 23 * scaleFactor +'px';
            winnerBox.style.borderRadius = 23 * scaleFactor +'px';
        }
        else {
            speed = 150 * 0.6;
            winnerBox.style.fontSize = 76 * scaleFactor +'px';
            winnerBox.style.margin = 25 * scaleFactor +'px';
            winnerBox.style.borderRadius = 25 * scaleFactor +'px';
        }
        winnerBox.textContent = eachWinner;
        winnersDiv.appendChild(winnerBox);
    }
}

function stopDrawing() {    //停止抽奖
    clearInterval(interval);
    document.getElementById('startBtn').style.display = "";
    document.getElementById('stopBtn').style.display = "none";
    document.getElementById('nameBtn').style.display = "none";
    document.getElementById('removeBtn').style.display = "";
    document.getElementById('nameBtn').disabled = false;    //停止抽奖时启用名单按钮
}

function removeWinners() {    //移除中奖
    if (winners.length == 0) {     //还没人中奖时
        showAlert(string_alert, string_exportAlert);
        return;
    }
    exportWinners();    //同时导出中奖
    setTimeout(function() {
        for (eachWinner of winners) {
            let index = names.indexOf(eachWinner);
            if (index !== -1) {
                names.splice(index, 1);
            }
        }
        winners = [];
        displayWinners();
        document.getElementById('nameBtn').innerHTML = names.length;    //更新总人数
        document.getElementById('nameBtn').style.display = "";
        document.getElementById('removeBtn').style.display = "none";
    }, 1000);
}

function exportWinners() {
    const currentDate = new Date();
    const timestamp = winners.length + ' winners - ' + currentDate.getFullYear() + '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    ('0' + currentDate.getDate()).slice(-2) + '-' +
    ('0' + currentDate.getHours()).slice(-2) +
    ('0' + currentDate.getMinutes()).slice(-2) +
    ('0' + currentDate.getSeconds()).slice(-2);

    /* 截图导出功能 */
    if (document.getElementById('png').checked) {
        /* 背景加载后的第一次截图大概率不会有背景图，所以这里触发两次截图，但不下载 */
        if (pngwaiting == 1) {
            htmlToImage.toPng(document.body);
            htmlToImage.toPng(document.body);

            /* 等待 500 ms 后第三次截图，并下载 */
            setTimeout (function(){
                htmlToImage.toPng(document.body).then(function (dataUrl) {
                    const link = document.createElement('a');
                    document.body.appendChild(link);
                    link.download = timestamp + '.png'; // 使用当前日期时间作为截图文件名
                    link.href = dataUrl;
                    link.click();
                    document.body.removeChild(link);
                    pngwaiting = 0;
                });
            }, 500);
        }
        
        else {
            htmlToImage.toPng(document.body).then(function (dataUrl) {
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.download = timestamp + '.png'; // 使用当前日期时间作为截图文件名
                link.href = dataUrl;
                link.click();
                document.body.removeChild(link);
            });
        }
    }

    /* txt 导出功能 */
    if (document.getElementById('txt').checked) {
        const winnersContent = winners.join('\n');  // 中奖人名单
        const leftPoolContent = names.filter(name => !winners.includes(name)).join('\n'); // 尚未中奖人名单
        const combinedContent = string_exportTemplate_p1 + winnersContent + string_exportTemplate_p2 + leftPoolContent;  // 整合中奖人名单和尚未中奖人的名单

        const filename = timestamp + '.txt';  // 使用当前日期时间作为名单 txt 文件名
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(combinedContent));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}