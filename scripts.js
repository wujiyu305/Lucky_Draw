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
        running = 1;    //首先将抽奖 Indicator 打开
        const numInput = document.getElementById('numInput');
        const numWinners = parseInt(numInput.value);    //获取设置的中奖人数并 Int 化

        if (numWinners != numInput.value){    //输入的中奖人数与 Int 化后的人数不一致，说明输入的不是整数
            alert('请确保在中奖人数处仅输入了整数哦。');
            return;
        }
        
        if (names.length == 0) {    //尚未设置名单的时候开始抽奖，则显示网页说明。
            alert("抽奖名单现在是空的哦。 \n\n 本网页使用说明： \n\n 1. 首先请使用“输入名单”设置候选名单，请使用逗号来间隔多个候选人。若人数较多，建议使用“导入名单”，支持导入 txt 文本文件，文件中可使用换行或者逗号来间隔多个候选人。若有重复名字，将自动保留其中一个。 \n\n 2. 在输入或者导入名单成功后，网页上会自动显示名单的总人数，然后请设置本轮抽奖数量，请不要设置得高于总人数。 \n\n 3. 点击“开始”以开始抽奖（支持使用键盘空格键），屏幕上会滚动随机显示对应数量的中奖人。点击“停止”以停止滚动（支持使用键盘空格键），此时中奖人固定不再变化，视为中奖。 \n\n 4. 使用“导出并移除”可以导出一个以当前时间为文件名的 txt 文档，其中包含当前中奖的名单和尚未中奖的名单，同时会将已经中奖的名单从总名单中移除，以避免重复中奖。");
            return;
        }
        
        if (numWinners > names.length) {    //中奖人数比总人数高
            alert('设置的中奖人数不能比总人数还高哦。');
            return;
        }
        
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
    names = names.filter(name => !winners.includes(name));
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
        winnerBox.textContent = eachWinner;
        winnersDiv.appendChild(winnerBox);
    }
}