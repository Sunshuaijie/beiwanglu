
const exp = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookie = require('cookie-parser');

const app = exp();

app.use(exp.static('wwwroot'));
app.use(cookie());
app.use(bodyParser.urlencoded({ extended: true }));


//show my mangerment
app.post('/show', (req, res) => {
    fs.exists('files', (exists) => {
        if (exists) {
            showfile();
        } else {
            fs.mkdir('files', (error) => {
                if (!error) {
                    showfile();
                } else {
                    res.status(200).json({
                        code: 0,
                        msg: '创建file文件夹失败'
                    })
                }
            })
        }
    })

    //封装一个写入函数
    function showfile() {
        var arr = [];
        // var arr2 = [];
        fs.readdir('files', (err, files) => {
            // arr1=files;
            if (!err) {
                // var fileCount;
                files.forEach(function(item,index){
                    fs.readdir('files/' + item, function (error, iner) {
                        if (!error) {
                            var obj={
                                fileName:item,
                                length: iner.length
                            }
                            arr.push(obj);
                            if(arr.length==files.length){
                                // console.log(arr)
                                arr.sort((a,b)=>(a.length>b.length));
                                res.status(200).json({
                                    code:1,
                                    data1:arr,
                                    msg:'读取成功'
                                })
                            }
                        }else{
                            console.log(error)
                        }
                    })
                })
            }
        })
    }
})


app.post('/creat', (req, res) => {
    var file = `files/${req.body.name}`;
    fs.exists(file, (exists) => {
        if (exists) {

        } else {
            fs.mkdir(file, (error) => {
                if (!error) {
                    fs.readdir('files', (error, files) => {
                        // console.log(files);
                        if (!error) {
                            res.status(200).json({
                                code: 1,
                                file: files,
                                msg: 'file文件创建成功'
                            })
                        }
                    })
                } else {
                    res.status(200).json({
                        code: 0,
                        msg: 'file文件创建失败'
                    })
                }
            })
        }
    })
})

//-------------selfile------------
app.get('/selfile', (req, res) => {
    var text = req.query.selfile;
    fs.exists('text.txt', (exists) => {
        if (exists) {
            write();
        } else {
            fs.createWriteStream('text.txt', (error) => {
                if (!error) {
                    res.status(200).json({
                        code: 1,
                        msg: 'text.txt创建成功'
                    })
                    write();
                } else {
                    res.status(200).json({
                        code: 0,
                        msg: 'text.txt创建失败'
                    })
                }
            })
        }
    })
    function write() {
        fs.writeFile('text.txt', text, (error) => {
            if (!error) {
                res.status(200).json({
                    code: 2,
                    msg: 'text.txt写入成功'
                })
            } else {
                res.status(200).json({
                    code: 3,
                    msg: 'text.txt写入失败'
                })
            }
        })
    }
})

//------------add-------------
app.post('/add', (req, res) => {
    fs.readFile('text.txt', (error, selfile) => {
        console.log(selfile)
        var selfile = selfile.toString()
        console.log(selfile)
        fs.readdir('files/' + selfile, (error, data) => {
            // console.log(data);
            if (!error) {
                res.status(200).json({
                    code: 1,
                    selfile: selfile,
                    data: data,
                    msg: '日程读取成功'
                })
            } else {
                res.status(200).json({
                    code: 0,
                    msg: '日程读取失败'
                })
            }
        })
    })
})
app.get('/add1',(req,res)=>{
    var text1=req.query.text1;
    res.cookie("fileName",text1);
})

//------------------edit-----------------------
app.get('/edit', (req, res) => {
    var text = req.query.text;
    // console.log(text);
    fs.readFile('text.txt', (error, selfile) => {
        var selfile = selfile.toString()
        // console.log(Date.now());
        // console.log(selfile);
        fs.writeFile('files/' + selfile + '/' + text, text, (error) => {
            if (!error) {
                res.status(200).json({
                    code: 1,
                    msg: '备忘录添加成功'
                })
            } else {
                res.status(200).json({
                    code: 0,
                    msg: '备忘录添加失败'
                })
            }
        })
    })
})


app.listen(3000, () => {
    console.log('服务器以为你开启');
})