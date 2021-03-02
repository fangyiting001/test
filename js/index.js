$(function () {
    let up = false;
    let down = false;
    let left = false;
    let right = false;
    let number;//子弹和敌机碰撞的次数
    let score = 0;
    let historynum = 0;//历史成绩
    let flag = false;//是否暂停
    let musicflag = false;//音乐是否播放
    let d;//敌机
    let zd;//子弹
    let bgmove;//背景移动
    let myplaneD;//我的飞机和敌机
    
    //点击开始页面
    document.getElementById("stargame").onclick = function () {
        document.getElementById("stargame").style.display="none"//开始游戏界面
        show();
        plane();
        addimg();
        Bullet();
        bg();
    }
    // 重新开始
    document.getElementById('restart').onclick = function () {
        document.getElementById("num").innerHTML = 0;//分数清空
        document.getElementById("end").style.display="none";
        document.getElementById('plane').style.bottom = 0;
        document.getElementById('plane').style.left = '160px';
        show();
        plane();
        addimg();
        Bullet();
        bg();
    }
    
    //键盘移动
    function plane () {
        $(document).keydown(function(e) {
            let keyCode = e.keyCode;
            let updown = Number(document.getElementById('plane').style.bottom.replace('px', ''));
            let leftright = Number(document.getElementById('plane').style.left.replace('px', ''));
            if (keyCode == 38 || keyCode == 87) {//向上
                up = true;
                Up(updown);
            }
            if (keyCode == 40 || keyCode == 83) {//向下
                down = true;
                Down(updown);
            }
            if (keyCode == 37 || keyCode == 65) {//向左
                left = true;
                Left(leftright);
            }
            if (keyCode == 39 || keyCode == 68) {//向右
                right = true;
                Right(leftright);
            }
    
            $(document).keyup(function () {//键盘弹起来的事件
                if (keyCode == 40 || keyCode == 83) {//下
                    down = false;
                }
                if (keyCode == 37 || keyCode == 65) {//左
                    left = false;
                }
                if (keyCode == 39 || keyCode == 68) {//右
                    right = false
                }
                if (keyCode == 38 || keyCode == 87) {//上
                    up = false
                }
            })
    
            if (up == true && left == true) {//上左
                Up(updown);
                Left(leftright)
            }
            if (up == true && right == true) {//上右
                Up(updown);
                Right(leftright);
            }
            if (down == true && right == true) {//下右
                Down(updown);
                Right(leftright);
            }
            if (down == true && left == true) {//下左
                Down(updown);
                Left(leftright);
            }
        })
    }
    
    //清除敌机 => 添加敌机
    function clearAir (x) {
        if (x.offsetTop >= 800) {
            x.remove();
        }
    }
    //添加敌机(随机)
    function addimg () {
        let x = ran(1,4)
        if (x == 1) {
            $("#index").append(
                `<div style = "left:${ran(30,360)}px;"class ='imgbox1 air' data-id ="3"></div>`
            )
            score += 10;
        } else if (x == 2) {
            $("#index").append(
                `<div style = "left:${ran(30,360)}px;"class ='imgbox2 air' data-id ="3"></div>`
            )
            score += 10;
        } else if (x == 3) {
            $("#index").append(
                `<div style = "left:${ran(30,360)}px;"class ='imgbox3 air' data-id ="2"></div>`
            )
            score += 8;
        } else if (x == 4) {
            $("#index").append(
                `<div style = "left:${ran(30,360)}px;"class ='imgbox4 air' date-id = "1" ></div>`
            )
            score += 5;
        }
        $('.air').animate({
            top:"820px",
        }, 9000, function () {
            document.querySelectorAll('.air').forEach(item => {
                clearAir(item);
            })
        })
        
        d = setTimeout(addimg, 1000);
        scan();//调用飞机跟敌机相碰撞
    }

   //点击页面可发射子弹
    // $('#index').mouseup(function() {
    //     Bullet()
    // })
    //清除子弹函数
    function clearbul (x) {
        if (x.offsetTop <= -10) {
            x.remove()
        }
    }
    //子弹事件(页面一开始自动发射子弹)
    function Bullet() {
       let toLeft = document.getElementById('plane').offsetLeft;
       let toTop = document.getElementById('plane').offsetTop;
        $("#index").append(
            `<div style = "left:${toLeft + 45}px; top:${toTop - 10}px" class ='bullet'></div>`
        )
        $('.bullet').animate({
            top:"-10px",
        }, 2000, function(){
            document.querySelectorAll(".bullet").forEach(item => {
                clearbul(item);
            })
        })
        document.getElementById('bulletmusic').play();//发射子弹的声音
        scanD();//子弹和敌机相互触碰
        zd = setTimeout(Bullet, 50);//(每间隔200ms发射一次子弹)
    }

    //判断子弹和敌机相互触碰(扫描) => 发射子弹子弹
    function scanD () {
        document.querySelectorAll('.bullet').forEach(val => {
            document.querySelectorAll('.air').forEach(item => {//敌机
                dom1(val,item);
            })
        })
    }

    //子弹和敌机 => 封装函数
    function dom1 (n, m) {
        let bulletY = n.offsetTop + (n.offsetHeight)/2;
        let bulletX = n.offsetLeft + (n.offsetWidth)/2;
        let airRX = (m.offsetWidth)/2 + 6;//敌机的半径+子弹的半径
        let airRY = (m.offsetHeight)/2 + 6;//敌机的半径+战斗机的半径
        let airY = m.offsetTop + (m.offsetHeight)/2;//敌机的纵坐标
        let airX = m.offsetLeft + (m.offsetWidth)/2;//敌机横坐标
        let nowX = Math.max(bulletX, airX) - Math.min(bulletX, airX);
        let nowY = Math.max(bulletY, airY) - Math.min(bulletY, airY);
        if ((airRX >= nowX) && (airRY >= nowY)) {//判断子弹跟敌机的半径是否大于现在子弹和敌机的半径
            document.getElementById('kitmusic').play();
            document.querySelectorAll('.air').forEach(vals => {
                number = Number(vals.getAttribute('data-id'));
                document.querySelectorAll('.air').forEach(item => {
                    if (item.getAttribute('data-id')) {
                        number--
                        // console.log(number);
                        if (number <= 0) {
                            n.remove();
                            m.remove();
                        }
                    }
                })
            }) 
            document.getElementById('num').textContent = score;
            document.getElementById('lastscore').textContent = score;
            
            //历史最高分
            if (localStorage.getItem("historycount") != null) {
                historynum = Number(localStorage.getItem('historycount'));
            }
            if (score > historynum) {
                localStorage.setItem("historycount", score)  
            }
            let historyval = Number(localStorage.getItem("historycount"));
            document.getElementById('historyscore').innerHTML = historyval;
        }
    }

    //判断我的飞机和敌机相互触碰(扫描) => 敌机
    function scan () {
        let battleX = document.getElementById('plane').offsetLeft +(document.getElementById('plane').offsetWidth)/2;
        let battleY = document.getElementById('plane').offsetTop + (document.getElementById('plane').offsetHeight)/2;
        document.querySelectorAll('.air').forEach(item => {
            let airRX = (item.offsetWidth)/2 + 40;//我飞机横坐标半径+敌机横坐标的半径
            let airRY = (item.offsetHeight)/2 + 40;//我飞机纵坐标的半径+战斗机纵坐标的半径
            let airY = item.offsetTop + (item.offsetHeight)/2;//敌机的纵坐标
            let airX = item.offsetLeft + (item.offsetWidth)/2;//敌机横坐标
            let nowX = Math.max(battleX, airX) - Math.min(battleX, airX);
            let nowY = Math.max(battleY, airY) - Math.min(battleY, airY);
            if ((airRX >= nowX) && (airRY >= nowY)) {   
                //碰撞结束游戏
                score = 0;
                $('.air').stop(true, false)
                $('.bullet').stop(true, false)
                $('#index_all').stop(true, false)
                clearTimeout(d);
                clearTimeout(zd);
                clearTimeout(bgmove);
                clearTimeout(myplaneD)
                $('.air').each((index,item)=>{
                    $(item).remove()
                })
                $('.bullet').each((index,item)=>{
                    $(item).remove()
                })
                document.getElementById('overmusic').play();
                document.getElementById('bulletmusic').pause();
                document.querySelector('.score').style.display = "none";
                document.getElementById('btn').style.display = "none";
                document.getElementById('end').style.display = "block";
                document.getElementById('plane').style.display = "none";
            }
        })
       myplaneD = setTimeout(scan,520);
    }

    //点击暂停、继续
    if ($('#btn')) {
        $('#btntext').html('暂停');
        document.getElementById('img').src = 'img/stop.png'
    } else {
        $('#btntext').html('继续');
        document.getElementById('img').src = 'img/star.png'
    }
    $('#btn').click(function () {
        if (flag == false) {
            flag = true;
            musicstop();
            $('#btntext').html('继续');
            document.getElementById('img').src = 'img/star.png';
            //清除暂定
            $('.air').stop(true, false)
            $('.bullet').stop(true, false)
            $('#plane').stop(true, true)
            $('#index_all').stop(true, false)
            clearTimeout(d);
            clearTimeout(zd);
            clearTimeout(bgmove);
        } else {
            $('#btntext').html('暂停');
            document.getElementById('img').src = 'img/stop.png'
            flag = false;  
            musicstar();
            //继续：重新调用函数 
            addimg();//敌机
            Bullet();//子弹
            plane();//我的飞机
            bg();
        }
    })

    // 点击播放/暂停音乐
    if ($('#music')) {
        document.getElementById('imgmusic').src = 'img/starmusic.png'
    } else {
        $('#btntext').html('继续');
        document.getElementById('imgmusic').src = 'img/stopmusic.png'
    }
    document.getElementById('music').onclick = function () {
        if (musicflag == false) {
            musicflag = true;
            document.getElementById('imgmusic').src = 'img/stopmusic.png'
            musicstop();
        } else {
            document.getElementById('imgmusic').src = 'img/starmusic.png';
            musicstar();
            musicflag = false;
        }
    }
    //背景图移动
    // bg();
    let n = 0
    function bg () {
        bgmove = setTimeout(function () {
            n++
        if(n == 2){
            n = 1
            $("#index_all").css("top","-900px")
        }
        $("#index_all").animate({
            top:"+=900px"
        }, 250, bg)
        }, 1)
        
    }

})

//音乐开始、暂停
function musicstop () {
    document.getElementById('Gamemusic').pause();
    document.getElementById('bulletmusic').pause();
    document.getElementById('overmusic').pause();
    document.getElementById('kitmusic').pause();
}
function musicstar () {
    document.getElementById('Gamemusic').play();
}

//随机数
function ran (x, y) {
    return Math.round(Math.random()*(y-x)+1);
}

//显示
function show () {
    document.getElementById('plane').style.display = "block";//我的飞机 
    document.querySelector('.score').style.display = "block";
    document.getElementById('btn').style.display = "block";
    document.getElementById('Gamemusic').play();//游戏音乐
}

//封装函数
function Up (x) {//上，，，传参
    x += 5;
        if (x > 800) {
            return;
        }
        document.getElementById('plane').style.bottom = x + "px";
        
 }

function Down (x) {//下
    x -= 5;
        if (x < 0) {
            return;
        }
        document.getElementById('plane').style.bottom = x + "px";
}

function Left (y) {
    y -= 5;
        if (y < 0) {
            return;
        }
        document.getElementById('plane').style.left = y + "px";
}

function Right (y) {
    y += 5;
        if (y > 340) {
            return;
        }
        document.getElementById('plane').style.left = y + "px";
}