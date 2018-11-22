'use strict';
/*生成简单的点线图数据，其中点之间有不同的类，貌似这里我们需要生成线数据了
只包含：
    每个点的度数；
    每个点的邻居数据；
    每个点是否隐藏文字标签；
    
*/
console.log("生成多类数据");
let jsonFile = './code/data/multClassData/data1.0.json';
let Log="";
let JsonData;
let StringData;
let Points = [];

let numOfClass = 2;
let NumOfPoints = 30;
let SvgWidth = 1000, SvgHeight = 1000;
let MaxNumOfPointLine = 5;
let IsLine = 0,
    IsBgLine = 1;
let LineWidth = 6,
    BgLineWidth = 12;//线宽，背景线宽
let countOfLines = 0;//线的数量
class Data {
    constructor(p, l) {
        this.Log = l;
        this.Points = p;
    }
}
/*
类:二分图中的点类
参数:
    id:点ID
    pos:点的相对顺序
    num:连接的点ID
    numLines:线的数量
    X:X坐标
    Y:Y坐标
备注:
*/
class Point {
    constructor(id) {
        this.pid = id;
        this.num = [];
        this.numLines = 0;
        this.X = -1;
        this.Y = -1;
        this.classId = getRandom(1,numOfClass)
    }
}
// /*
// 类:二分图中的线类
// 参数:
//     lid:线id
//     iid:对应的PointNumA的点的ID
//     jid:PoingNumB
//     isLine:是否是线，还是背景线。0线 1背景线
//     //isTop:是否要将这条线置顶
// 备注:
// */
// class Line {
//     constructor(id, pi, pj, isline) {
//         this.lid = id;
//         this.iid = pi;
//         this.jid = pj;
//         this.isLine = isline;
//         this.width = isline ? BgLineWidth : LineWidth;//这里的判定是反过来的，因为isLine 0和isNotLine 1
//         this.color = isline ? "white" : "green";
//         this.sX = -1;
//         this.sY = -1;
//         this.eX = -1;
//         this.eY = -1;
//     }
// }

//新建点
for (let i = 0; i < NumOfPoints; i++) {
    let curPoint = new Point(i);
    Points.push(curPoint);
}
//设置每个点的线数量和横纵坐标(横纵坐标不再生成)
for (let i = 0; i < Points.length; i++) {
    let curNumOfLines = getRandom(1, MaxNumOfPointLine);
    Points[i].numLines = curNumOfLines;
    // Points[i].X = getRandom(0, SvgWidth)+300;
    // Points[i].Y = getRandom(0, SvgHeight)+300;
}

//生成连线
for (let i = 0; i < Points.length-1; i++) {
    Points[i].showText = true;//每一个点都有对象的文字，这个选项表示是否隐藏
    let numTry = 0;//寻找点的尝试次数
    if (Points[i].num.length < Points[i].numLines) {
        let curNumOfLines = Points[i].numLines - Points[i].num.length
        for (let j = 0; j < curNumOfLines; j++) {
            let curPointId = getRandom(i + 1, Points.length - 1);
            numTry++;
            //console.log(curPointId);
            
            //if (!numContains(Points[i].num, curPointId) && !numContains(Points[curPointId].num, i) && Points[curPointId].num.length < Points[curPointId].numLines) {
            if (!numContains(Points[i].num, curPointId) && !numContains(Points[curPointId].num, i) && Points[curPointId].num.length < Points[curPointId].numLines) {
                Points[i].num.push(curPointId);
                Points[curPointId].num.push(i);
                //生成连线数据
                // let curLine = new Line(++countOfLines, i, Points[i].num[j], IsLine);
                // let curBgLine = new Line(countOfLines, i, Points[i].num[j], IsBgLine);
                // curLine.sX = Points[i].X;
                // curLine.sY = Points[i].Y;
                // curBgLine.sX = curLine.sX
                // curBgLine.sY = curLine.sY

                // curLine.eX = Points[Points[i].num[j]].X;
                // curLine.eY = Points[Points[i].num[j]].Y;
                // curBgLine.eX = curLine.eX
                // curBgLine.eY = curLine.eY

                // Lines.push(curBgLine);
                // Lines.push(curLine);
                numTry++;
            } else {
                numTry++;
                j--;//这次的点不对就重新生成
                if (numTry > NumOfPoints) {
                    console.log('hello');
                    break;
                }
            }
        }
    }
}


Log = ""+numOfClass;

JsonData = new Data(Points, Log);
StringData = JSON.stringify(JsonData);
let fs = require('fs');
fs.writeFile(jsonFile, StringData, function (err) {
    if (err) {
        console.error(err);
    }
    console.log('----------新增成功-------------');
})


/*
函数：生成a-b的随机整数（包含a，b）,a，b不为整数则向下取整
参数：
    a:最小值整数
    b:最大值整数
备注:a<b
*/
function getRandom(a, b) {
    a = Math.floor(a);
    b = Math.floor(b);
    if (a > b)
        return -1;
    return Math.round(Math.random() * (b - a) + a);
}
/*
函数:数组查重
参数:
    num:数组
    value:待查重元素
备注:
*/
function numContains(num, value) {
    for (let i = 0; i < num.length; i++)
        if (num[i] === value)
            return true;
    return false;
}
/*
函数:从数组中得到对应ID的元素
参数:
    num:数组
    pid:待选择ID
备注:
*/
function getPoint(num, id) {
    let cur = parseInt(id);
    for (let i = 0; i < num.length; i++) {
        if (num[i].pid === cur) {
            return num[i];
        }
    }
    return -1;
}