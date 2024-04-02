let names = [];
let winners = [];
let interval;
let speed = 150;     //默认滚动速度 150 ms
let pngwaiting = 1;
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
        document.getElementById('scale').value = urlPara.get('scale');
        document.getElementById('speed').value = urlPara.get('speed');
        
        /* 加载 String */
        stringLoader();

        /* 网页加载完后 3 秒延迟隐藏说明窗口 */
        setTimeout(function() {
            showInfo('hide');
        }, 3000);
    });
    document.addEventListener('keydown', function(event){
        if(event.key ==' ') {       //监听空格键来触发开始抽奖
            if (document.getElementById('stopBtn').style.display == 'none') {
                startDrawing();
            }
            else {
                stopDrawing();
            }
        }
    });
    document.getElementById('scale').addEventListener('input', function() {
        displayWinners();     // 调整大小滑块时缩放 winnerBox
    });
    window.addEventListener('resize', function() {
        displayWinners();     // 在窗口大小变化时缩放 winnerBox
    });
}

function stringLoader() {

    /* 多语言网页 String 设置区域 */
    /* zh */
    const string_pageTitle_zh = "幸运抽奖";
    const string_infoTitle_zh = "使用说明";
    const string_infoContent_zh = "<li><p>首先请使用“设置名单”设置候选名单，支持导入 txt 文本文件，文件中可使用换行或者逗号来间隔多个候选人。若有重复名字，会自动去重。</p></li><li><p>成功名单成功后，名单按钮自动显示名单的总人数，点击按钮显示详细名单。</p></li><li><p>然后请设置本轮抽奖数量，请设置得低于总人数。</p></li><li><p>点击“开始”以开始抽奖，屏幕上会滚动随机显示对应数量的中奖人。点击“停止”以停止滚动，此时中奖人固定不再变化，视为中奖。</p></li><li><p>支持使用键盘上的空格键触发开始/停止。</p></li><li><p>使用“导出并移除”导出一个以当前时间为文件名的 txt 文件，包含当前中奖的名单和尚未中奖的名单，同时会将已经中奖的名单从总名单中移除，避免重复中奖。</p></li>";
    const string_settingsTitle_zh = "设置";
    const string_winnerSize_zh = "中奖人显示大小";
    const string_winnerSpeed_zh = "中奖人滚动速度";
    const string_expTXT_zh = "导出 txt 文本";
    const string_expPNG_zh = "导出 png 文本";
    const string_startBtn_zh = "开始";
    const string_startBtn_title_zh = "设置名单后，点击开始按钮或者按下键盘空格键以开始抽奖，屏幕上会滚动随机显示对应数量的中奖人。";
    const string_stopBtn_zh = "停止";
    const string_stopBtn_title_zh = "点击停止按钮或者按下键盘空格键以停止，中奖人固定不再变化，视为中奖。";
    const string_numInput_title_zh = "设置本轮抽奖的中奖人数量，请设置得低于总人数。";
    const string_setBtn_zh = "设置名单";
    const string_setBtn_title_zh = "支持导入 txt 纯文本文件，请在 txt 中通过换行或者逗号来间隔多个候选人名字，不要出现重复的名字。如果人数较少，也可以输入名单。";
    const string_nameBtn_zh = "显示名单";
    const string_nameBtn_title_zh = "显示当前奖池的名单。";;
    const string_removeBtn_zh = "导出并移除";
    const string_removeBtn_title_zh = "导出一个以当前时间为文件名的 txt 文档，其中包含当前中奖的名单和尚未中奖的名单，同时将已经中奖的名单从总名单中移除，避免重复中奖。";
 

    /* en */
    const string_pageTitle_en = "Lucky Draw";
    const string_infoTitle_en = "Instruction";
    const string_infoContent_en = "<li><p>Hit \"Set List\" to set candidates, you can import candidates from a txt file, seperate multiple names with comma or new line. Duplicated names would be auto-removed.</p></li><li><p>The number of total candidates would show on the button after list set.</p></li><li><p>Then please set the number of winners for this round.</p></li><li><p>Hit \"Start\", winner names would appear on screen and change quickly. Hit \"Stop\", name would stop changing and these names are winners.</p></li><li><p>You can use the Space key on keyboard to Start/Stop.</p></li><li><p>Use \"Exp & Rem\" (Export & Remove) to export a txt file names under current time, which contains winners for this round and non-winner names. And winners would be removed to prevent them from being winner again for next round.</p></li>";
    const string_settingsTitle_en = "Settings";
    const string_winnerSize_en = "中奖人显示大小";
    const string_winnerSpeed_en = "中奖人滚动速度";
    const string_expTXT_en = "导出 txt 文本";
    const string_expPNG_en = "导出 png 文本";
    const string_startBtn_en = "Start";
    const string_startBtn_title_en = "设置名单后，点击开始按钮或者按下键盘空格键以开始抽奖，屏幕上会滚动随机显示对应数量的中奖人。";
    const string_stopBtn_en = "Stop";
    const string_stopBtn_title_en = "点击停止按钮或者按下键盘空格键以停止，中奖人固定不再变化，视为中奖。";;
    const string_numInput_title_en = "设置本轮抽奖的中奖人数量，请设置得低于总人数。";
    const string_setBtn_en = "Set List";
    const string_setBtn_title_en = "支持导入 txt 纯文本文件，请在 txt 中通过换行或者逗号来间隔多个候选人名字，不要出现重复的名字。如果人数较少，也可以输入名单。";
    const string_nameBtn_en = "Show Names";
    const string_nameBtn_title_en = "显示当前奖池的名单。";;
    const string_removeBtn_en = "Exp % Rem";
    const string_removeBtn_title_en = "导出一个以当前时间为文件名的 txt 文档，其中包含当前中奖的名单和尚未中奖的名单，同时将已经中奖的名单从总名单中移除，避免重复中奖。";
 
    


    document.title = string_pageTitle_zh;
    document.getElementById('infoBotton').title = string_infoTitle_zh;
    document.getElementById('infoTitle').innerText = string_infoTitle_zh;
    document.getElementById('infoContent').innerHTML = string_infoContent_zh;
    document.getElementById('settingsBotton').title = string_settingsTitle_zh;
    document.getElementById('settingsTitle').innerText = string_settingsTitle_zh;
    document.getElementById('winnerSize').innerText = string_winnerSize_zh;
    document.getElementById('winnerSpeed').innerText = string_winnerSpeed_zh;
    document.getElementById('expTXT').innerText = string_expTXT_zh;
    document.getElementById('expPNG').innerText = string_expPNG_zh;
    document.getElementById('startBtn').innerText = string_startBtn_zh;
    document.getElementById('startBtn').title = string_startBtn_title_zh;
    document.getElementById('stopBtn').innerText = string_stopBtn_zh;
    document.getElementById('stopBtn').title = string_stopBtn_title_zh;
    document.getElementById('numInput').title = string_numInput_title_zh;
    document.getElementById('setBtn').innerText = string_setBtn_zh;
    document.getElementById('setBtn').title = string_setBtn_title_zh;
    document.getElementById('nameBtn').innerText = string_nameBtn_zh;
    document.getElementById('nameBtn').title = string_nameBtn_title_zh;
    document.getElementById('removeBtn').innerText = string_removeBtn_zh;
    document.getElementById('removeBtn').title = string_removeBtn_title_zh;
}


function showInfo(showorhide) {
    const info = document.getElementById('info');
    const settings = document.getElementById('settings');
    if (showorhide == 'show'){
        info.style.transform = 'scale(1)';
        settings.style.transform = 'scale(0)';
        return
    }
    if (showorhide == 'hide'){
        info.style.transform = 'scale(0)';
        return
    }
    info.style.transform = info.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
    settings.style.transform = 'scale(0)';
}

function showSettings(showorhide) {
    const info = document.getElementById('info');
    const setting = document.getElementById('settings');
    setting.style.transform = setting.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
    info.style.transform = 'scale(0)';
}

function setNames() {    //导入名单
    const choice = confirm("即将从 txt 文件导入名单。\n\n如果人数较少，可取消以手动输入名单。");
    if (choice) {
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
                    alert("1 个人就不用抽奖来吧。");
                }
                else {
                    alert("导入失败，请检查 txt 文件。");
                }
            };
        reader.readAsText(file);
    });
    fileInput.click();
    }
    else {
        const contents = prompt('请输入抽奖名单，以逗号间隔多个名字。\n若有重复名字，将自动保留其中一个。');
        names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');    //支持中英文逗号及换行间隔
        names = Array.from(new Set(names));    //去除重复值
        if (names.length > 1) {
            document.getElementById('nameBtn').innerHTML = names.length;    //更新总人数
            document.getElementById('setBtn').style.display = "none";
            document.getElementById('nameBtn').style.display = "";
        }
        else if (names.length == 1) {
            alert("1 个人就不用抽奖来吧。");
        }
        else {
            alert("检测失败，请重新输入。");
        }
    }
}

function showNames() {
    const allNames = names.join('\n');
    alert('当前奖池中名单如下：\n\n' +allNames);
}

function startDrawing() {    //开始抽奖
    const numInput = document.getElementById('numInput');
    const numWinners = parseInt(numInput.value);    //获取设置的中奖人数并 Int 化

    if (numWinners != numInput.value){    //输入的中奖人数与 Int 化后的人数不一致，说明输入的不是整数
        alert('请确保在中奖人数处仅输入了整数哦。');
        showInfo('show');
        return;
    }
    
    if (names.length == 0) {    //尚未设置名单的时候开始抽奖，则显示网页说明。
        alert("抽奖名单现在是空的哦。");
        showInfo('show');
        return;
    }
    
    if (numWinners >= names.length) {    //中奖人数比总人数高或相同
        alert('请设置比总人数少的中奖人数。');
        showInfo('show');
        return;
    }
    
    if (numWinners <= 0) {    //中奖人数不是正数
        alert('请设置大于 1 的中奖人数。');
        showInfo('show');
        return;
    }
    
    showInfo('hide');
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
        let scaleFactor = Math.sqrt((window.innerWidth * window.innerHeight) / (1440 * 800));   // 以 1440 * 800 的窗口大小为基准按比例缩放
        scaleFactor = scaleFactor * Math.pow(3 / (names.reduce((acc, name) => acc + name.length, 0) / names.length), 0.2);   // 以平均每个名字 3 个字符为基准按比例缩放
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
    if (winners.length == 0) {     //还没人中奖时
        alert("这一轮还没有人中奖哦。");
        return;
    }

    const currentDate = new Date();
    const timestamp = winners.length + ' winners - ' + currentDate.getFullYear() + '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    ('0' + currentDate.getDate()).slice(-2) + '-' +
    ('0' + currentDate.getHours()).slice(-2) +
    ('0' + currentDate.getMinutes()).slice(-2) +
    ('0' + currentDate.getSeconds()).slice(-2);

    /* 截图导出功能 */
    if (document.getElementById('png').checked) {
        htmlToImage.toPng(document.body).then(function (dataUrl) {

            /* 网页加载后的第一次截图大概率不会有背景图，所以第一次的截图不要，等待 150 ms 第二次截图 */
            if (pngwaiting == 1) {
                pngwaiting = 0;
                htmlToImage.toPng(document.body).then(function () {
                    setTimeout(150);
                });
            }
            /* 等待 150 ms 第二次截图 */
            const link = document.createElement('a');
            document.body.appendChild(link);
            link.download = timestamp + '.png'; // 使用当前日期时间作为截图文件名
            link.href = dataUrl;
            link.click();
            document.body.removeChild(link);
        });
    }

    /* txt 导出功能 */
    if (document.getElementById('txt').checked) {
        const winnersContent = winners.join('\n');  // 中奖人名单
        const leftPoolContent = names.filter(name => !winners.includes(name)).join('\n'); // 尚未中奖人名单
        const combinedContent = '********** 当轮中奖 **********\n\n' + winnersContent + '\n\n****************************' +'\n\n\n\n\n\n\n\n\n********** 尚未中奖 **********\n\n' + leftPoolContent;  // 整合中奖人名单和尚未中奖人的名单

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