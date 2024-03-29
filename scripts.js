let names = []; 
let winners = [];
let running = 0;
let interval;
spaceListener();

function spaceListener() {    //监听空格键来触发开始抽奖
    document.addEventListener('keydown',function(event){
        if(event.key ==' '){startDrawing();}
    });
}

function toggleButtonAvailability(buttonId) {    //切换按钮可用性
    if (document.getElementById(buttonId).disabled == true) {
        document.getElementById(buttonId).disabled = false;
    }
    else {
        document.getElementById(buttonId).disabled = true;
    }
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

function typetNames() {    //输入名单
    const contents = prompt('请输入抽奖名单，以逗号间隔多个名字。\n若有重复名字，将自动保留其中一个。');
    names = contents.split(/[,|，]/).map(name => name.trim()).filter(name => name !== '');    //支持中英文逗号间隔
        if (names.length > 0) {
            names = Array.from(new Set(names));    //去除重复值
            document.getElementById('numAll').innerHTML = "/" + names.length;    //更新总人数
        } else {
            alert("识别失败，请检查输入的内容。");
        }
}
function importNames() {    //导入名单
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const contents = event.target.result;
            names = contents.split(/[,|，|\n]/).map(name => name.trim()).filter(name => name !== '');    //支持中英文逗号及换行间隔
            if (names.length > 0) {
                names = Array.from(new Set(names));    //去除重复值
                document.getElementById('numAll').innerHTML = "/" + names.length;    //更新总人数
            } else {
                alert("导入失败，请检查 txt 文件。");
            }
        };
        
        reader.readAsText(file);
    });
    
    fileInput.click();
}   

function startDrawing() {    //开始抽奖
    if (running == 0){    //确定当前未在抽奖中
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
        
        running = 1;    //将抽奖 Indicator 打开
        showInfo('hide');
        toggleButtonAvailability('typeBtn');    //开始抽奖时禁用输入名单按钮
        toggleButtonAvailability('importBtn');    //开始抽奖时禁用导入名单按钮
        toggleButtonAvailability('removeBtn');    //开始抽奖时禁用移除按钮
        document.getElementById('startBtn').innerHTML = "停止";    //开始抽奖后，开始显示为停止

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
    else{
        stopDrawing();    //如果已经在抽奖则，按钮的功能时停止抽奖
    }
}

function stopDrawing() {    //停止抽奖
    running = 0;    //首先将抽奖 Indicator 关闭
    clearInterval(interval);
    toggleButtonAvailability('typeBtn');    //停止抽奖时启用输入名单按钮
    toggleButtonAvailability('importBtn');    //停止抽奖时启用导入名单按钮
    toggleButtonAvailability('removeBtn');    //停止抽奖时启用移除按钮
    document.getElementById('startBtn').innerHTML = "开始";    //开始抽奖后，开始显示为停止
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
    document.getElementById('numAll').innerHTML = "/" + names.length;;    //记得显示移除后的总人数
}

function exportWinners() {
    if (winners.length == 0) {     //还没人中奖时
        alert("现在还没有人中奖哦。");
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

    for (eachWinner of winners) {     // DIV 中逐一插入中间人的名字
        const winnerBox = document.createElement('div');
        winnerBox.classList.add('winner-box');
        if (winners.length >= 100) {
            winnerBox.classList.add('winner-box-100');
        }
        else if (winners.length >= 80) { 
            winnerBox.classList.add('winner-box-80');
        }
        else if (winners.length >= 50) { 
            winnerBox.classList.add('winner-box-50');
        }
        else if (winners.length >= 30) { 
            winnerBox.classList.add('winner-box-30');
        }
        else if (winners.length >= 15) { 
            winnerBox.classList.add('winner-box-15');
        }
        else if (winners.length >= 10) { 
            winnerBox.classList.add('winner-box-10');
        }
        else if (winners.length >= 5) { 
            winnerBox.classList.add('winner-box-5');
        }
        else if (winners.length >= 3) { 
            winnerBox.classList.add('winner-box-3');
        }                             //根据中奖人数适当调整方框大小
        winnerBox.textContent = eachWinner;
        winnersDiv.appendChild(winnerBox);
    }
}
