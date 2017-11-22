const board = new Array();
const hasConflicted = new Array();
const best = localStorage.getItem('best');

let score = 0;

let newgame = () => {
    //初始化数据
    init();
    //随机生成数字
    generateOneNumber();
    generateOneNumber();
}

let getPostTop = (i, j) => 20 + i * 120;
let getPostLeft = (i, j) => 20 + j * 120;

/* 生成数字 */
let generateOneNumber = () => {
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    let randomx = Math.floor(Math.random() * 4);
    let randomy = Math.floor(Math.random() * 4);

    let times = 0;
    //判断是否有数字
    while (times < 50) {
        if (board[randomx][randomy] === 0) {
            break;
        }
        randomx = Math.floor(Math.random() * 4);
        randomy = Math.floor(Math.random() * 4);

        times++;
    }

    if (times === 50) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    randomx = i;
                    randomy = j;
                }
            }
        }
    }


    //随机一个数字 2 或者 4
    let ranNumber = Math.random() < 0.5 ? 2 : 4;

    //显示数字
    board[randomx][randomy] = ranNumber;

    showNumberWithAnimation(randomx, randomy, ranNumber);

    return true;
}

/* 判断是否存在位置 */
let nospace = board => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

/* 显示数字 */
let showNumberWithAnimation = (x, y, random) => {
    let $numberCell = $('#number-cell-' + x + '-' + y);
    let text = change(random);
    $numberCell.css({
        "background-color": getNumberBackgroundColor(random),
        "color": getNumberColor(random),
    })
        .animate({
            width: '100px',
            heigth: '100px',
            top: getPostTop(x, y),
            left: getPostLeft(x, y),
        }, 50, function () {
            $(this).text(text);
        });
}

let change = random => {
    switch (random) {
        case 2: return "斗之气"; break;
        case 4: return "斗者 "; break;
        case 8: return "斗师"; break;
        case 16: return "大斗师"; break;
        case 32: return "斗灵"; break;
        case 64: return "斗王"; break;
        case 128: return "斗皇"; break;
        case 256: return "斗宗"; break;
        case 512: return "斗尊"; break;
        case 1024: return "斗圣"; break;
        case 2048: return "斗帝"; break;
        case 4096: return "人生巅峰"; break;
        case 8192: return "至尊老王"; break;
    }
}

/* 初始化操作 */
let init = () => {
    /* 初始化内置元素位置 */
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPostTop(i, j));
            gridCell.css('left', getPostLeft(i, j));
        }
    }

    /* 初始化二位数组 */
    for (let i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBorderView();

    score = 0;
}

/* 根据 board 值进行操作 */
let updateBorderView = () => {
    $('.number-cell').remove();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let _cell = '<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>';
            $('.grid-container').append($(_cell));

            /* board 值进行判断显示 */
            let $cell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] === 0) {
                $cell.css({
                    width: 0,
                    heigth: 0,
                    top: getPostTop(i, j) + 50,
                    left: getPostLeft(i, j) + 50
                });
            }
            else {
                $cell.css({
                    width: "100px",
                    heigth: "100px",
                    top: getPostTop(i, j),
                    left: getPostLeft(i, j),
                    color: getNumberColor(board[i][j]),
                    "background-color": getNumberBackgroundColor(board[i][j])
                }).text(change(board[i][j]));
            }

            hasConflicted[i][j] = false;
        }
    }
}

/* 设置背景颜色 */
let getNumberBackgroundColor = number => {
    switch (number) {
        case 2: return "#eee4da"; break;
        case 4: return "#ede0c8"; break;
        case 8: return "#f2b179"; break;
        case 16: return "#f59563"; break;
        case 32: return "#f67c5f"; break;
        case 64: return "#f65e3b"; break;
        case 128: return "#edcf72"; break;
        case 256: return "#edcc61"; break;
        case 512: return "#9c0"; break;
        case 1024: return "#33b5e5"; break;
        case 2048: return "#09c"; break;
        case 4096: return "#a6c"; break;
        case 8192: return "#93c"; break;
    }
    return "black";
}

/* 设置字体颜色 */
let getNumberColor = number => {
    if (number <= 4) {
        return "#776e65";
    }
    return "white";
}

/* 是否可以左转 */
let moveLeft = () => {
    if (!canMoveLeft(board)) {
        return false;
    }

    /* 向左移动 */
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < j; k++) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k); //move
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] === board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //move
                        board[i][k] += board[i][j];  //add
                        board[i][j] = 0;

                        //add score 
                        score += board[i][k];
                        updateScore(board[i][k], score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBorderView()", 200);
    return true;
}

let canMoveLeft = board => {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

/* 判断是否有障碍物 */
let noBlockHorizontal = (row, fromX, toX, board) => { // row -> 第几行  fromX->初始列  toX->终止列 
    for (let m = fromX + 1; m < toX; m++) {
        if (board[row][m] != 0) {
            return false;
        }
    }
    return true;
}

/* 判断是否有障碍物 */
let noBlockVertical = (collunm, fromY, toY, board) => { // collunm->第几列  fromY -> 初始行  toY->终止行
    for (let m = fromY + 1; m < toY; m++) {
        if (board[m][collunm] != 0) {
            return false;
        }
    }
    return true;
}

/* 右移 */
let moveRight = () => {
    if (!canMoveRight(board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] === 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k); //move
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        // continue;
                    }
                    else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //move
                        board[i][k] += board[i][j];  //add
                        board[i][j] = 0;

                        //add score 
                        score += board[i][k];
                        updateScore(board[i][k], score);

                        hasConflicted[i][k] = true;
                        // continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBorderView()", 200);
    return true;
}

let canMoveRight = board => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

/* 移动操作 */
let showMoveAnimation = (fromX, fromY, toX, toY) => {
    let $cell = $('#number-cell-' + fromX + '-' + fromY);
    $cell.animate({
        top: getPostTop(toX, toY),
        left: getPostLeft(toX, toY)
    }, 200);
}

/* 上移 */
let moveUp = () => {
    if (!canMoveUp(board)) {
        return false;
    }

    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < i; k++) {
                    if (board[k][j] === 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j); //move
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if (board[k][j] === board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //move
                        board[k][j] += board[i][j];  //add
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(board[k][j], score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }
    setTimeout("updateBorderView()", 200);
    return true;
}
let canMoveUp = board => {
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}


let moveDown = () => {
    if (!canMoveDown(board)) {
        return false;
    }
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > i; k--) {
                    if (board[k][j] === 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j); //move
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if (board[k][j] === board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //move
                        board[k][j] += board[i][j];  //add
                        board[i][j] = 0;

                        score += board[k][j];
                        updateScore(board[k][j], score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }
    setTimeout("updateBorderView()", 200);
    return true;
}

let canMoveDown = board => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] === 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}




let isgameOver = () => {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

let nomove = board => {
    if (canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveUp(board)) {
        return false;
    }
    return true;
}

let gameover = () => {
    alert("这就没了？？？ 不行哦 ？");
    alert("还点是 ？？？！！是不是傻 ？");
    alert("是不是想走？？？");
    alert("就是不想让你走，你打我啊？？？");
    alert("是不是还想走？？？");
    alert("叫爸爸勒？？爸爸的做的游戏能让你走？？");

    Promot();
}

let updateScore = (add, score) => {

    let _best = $('.best-container').text();

    $('.add-score').text('+' + add)
        .animate({
            top: "-10px",
            opacity: 1
        }, 200, "linear", function () {
            $(this).css({
                top: "10px",
                opacity: 0
            }).prev('b').text(score);

            if (score > _best) {
                $('.best-container').text(score);
                localStorage.setItem('best', score);
            }
        });
}

function Promot() {
    let name = prompt("填空,我是你最亲的：")
    if (name != null && name === "爸爸") {
        alert("能不能走点心？？是不是傻？？再给你一次机会");
        let second = prompt("请问,你最喜欢叫我什么？")
        if (second != null && second === "爸爸") {
            alert("乖孩子，爸爸是爱你的，么么哒")
        } else {
            alert("算了，看你可怜，就饶了你吧，父爱如山啊");
        }
    }
    else {
        alert("能屈能伸懂啊？？爸爸这么爱你");
        Promot();
    }
}

$(() => {
    if (best !== 0 && best !== null) {
        $('.best-container').text(best);
    }
    newgame();
});


$(document).keydown(event => {
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
            break;
        case 40:  //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
            break;
        default: break;
    }
});

let startX = 0;
let startY = 0;

let endX = 0;
let endY = 0;

document.addEventListener('touchstart', event => {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener('touchmove', event => {
    event.preventDefault();
});

document.addEventListener('touchend', event => {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    let deltaX = endX - startX;
    let deltaY = endY - startY;

    if (Math.abs(deltaX) < 0.1 * document.body.clientWidth && Math.abs(deltaY) < 0.1 * document.body.clientWidth) {
        return;
    }

    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        if (deltaX >= 0) { //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            }
        }
        else { //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
        }
    }
    else {
        if (deltaY <= 0) { //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
        } else { //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameOver()", 300);
            };
        }
    }
});

