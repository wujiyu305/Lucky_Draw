let names = [];
let winners = [];
let interval;
listener();

function listener() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            showInfo('hide');
        }, 3000); // 网页加载完后 3 秒延迟隐藏说明窗口
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
    window.addEventListener('resize', function() {
        displayWinners();     // 在窗口大小变化时缩放 winnerBox
    });
}

function showInfo(showorhide) {
    const info = document.getElementById('info');
    if (showorhide == 'show'){
        info.style.transform = 'scale(1)';
        return
    }
    if (showorhide == 'hide'){
        info.style.transform = 'scale(0)';
        return
    }
    info.style.transform = info.style.transform == 'scale(1)' ? 'scale(0)' : 'scale(1)';
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
    }, 150);     //刷新间隔 150 毫秒
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
}

function exportWinners() {
    if (winners.length == 0) {     //还没人中奖时
        alert("这一轮还没有人中奖哦。");
        return;
    }

    const currentDate = new Date();
    const timestamp = currentDate.getFullYear() + '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    ('0' + currentDate.getDate()).slice(-2) + '-' +
    ('0' + currentDate.getHours()).slice(-2) +
    ('0' + currentDate.getMinutes()).slice(-2) +
    ('0' + currentDate.getSeconds()).slice(-2);
    
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


 function displayWinners() {     //显示中奖人
    const winnersDiv = document.getElementById('winners');
    winnersDiv.innerHTML = '';

    for (eachWinner of winners) {     // DIV 中逐一插入奖人的名字
        const winnerBox = document.createElement('div');
        winnerBox.classList.add('winnerBox');
        let scaleFactor = Math.sqrt((window.innerWidth * window.innerHeight) / (1440 * 800));   // 以 1440 * 800 的窗口大小为基准按比例缩放
        scaleFactor = scaleFactor * Math.pow(3 / (names.reduce((acc, name) => acc + name.length, 0) / names.length), 0.2);   // 以平均每个名字 3 个字符为基准按比例缩放
        if (winners.length >= 10) {
            scaleFactor = scaleFactor * Math.pow((10 / winners.length), 0.4);    // 以 10 人中奖的的 Box 大小为基准按比例缩放
            winnerBox.style.fontSize = 64 * scaleFactor +'px';
            winnerBox.style.margin = 20 * scaleFactor +'px';
            winnerBox.style.borderRadius = 20 * scaleFactor +'px';
            winnerBox.style.padding = 10 * Math.pow(scaleFactor, 0.4) +'px ' + 40 * scaleFactor +'px';
        }
        else if (winners.length >= 5) {
            winnerBox.style.fontSize = 68 * scaleFactor +'px';
            winnerBox.style.margin = 22 * scaleFactor +'px';
            winnerBox.style.borderRadius = 22 * scaleFactor +'px';
        }
        else if (winners.length >= 3) {
            winnerBox.style.fontSize = 72 * scaleFactor +'px';
            winnerBox.style.margin = 23 * scaleFactor +'px';
            winnerBox.style.borderRadius = 23 * scaleFactor +'px';
        }
        else {
            winnerBox.style.fontSize = 76 * scaleFactor +'px';
            winnerBox.style.margin = 25 * scaleFactor +'px';
            winnerBox.style.borderRadius = 25 * scaleFactor +'px';
        }
        winnerBox.textContent = eachWinner;
        winnersDiv.appendChild(winnerBox);
    }
}