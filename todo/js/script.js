let radio = document.getElementById('radio');
let main_field = document.getElementById('main_field');

var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
function createTable(db) { 
    db.transaction(function (t) { 
        t.executeSql("CREATE TABLE METKA(data TEXT)", []); 
    });
}
createTable(db);
function insertData(db, data) {
    db.transaction(function (e) { 
        e.executeSql("INSERT INTO METKA(data) VALUES (?)", [data]); 
    }); 
}
function OK(){
    window.location.reload();
}
function dateView(db){
    db.transaction(function (t) { 
        t.executeSql("SELECT * FROM METKA", [], 
        function (tran, r) { // создание функции
            for (let i = 0; i < r.rows.length; i++) { // создание цикла
                var date = r.rows.item(i).data;
                // CREATE BLOCK HTML
                main_field.insertAdjacentHTML('afterbegin', `<div class="field"><div class="radio" id="radio" onclick="closed(this)"><div class="chek" id="chek"></div></div><div class="span"><div class="line"></div>${date}</div><button class="del_butt" onclick="del(this)">X</button></div>`);
            }
        }
        );
    });
}

function del_load() {
    let fields = document.querySelectorAll('.field');
    for(let i = 0; i < fields.length; i++){
        fields[i].remove();
    }
}
function closed(item){
    item.querySelector('#chek').style.display = 'flex';
    item.style.border = 'solid #777777 2px';
    item.firstChild.style.backgroundColor = '#777777';
    item.nextSibling.firstChild.style.width = '100%';
    item.nextSibling.firstChild.style.backgroundColor = '#777777';
    item.parentElement.style.color = '#777777';
    setTimeout(() => { del(item) }, 1000);
}
function del(item){

    item.parentElement.remove();

    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    try{
        if(item.previousElementSibling.textContent)
        db.transaction(function (t) 
        {	
            t.executeSql('DELETE FROM METKA WHERE data=?;',[item.previousElementSibling.textContent], OK());
        });
    }
    catch{
        if (item.nextSibling.textContent)
        db.transaction(function (t) 
        {	
            t.executeSql('DELETE FROM METKA WHERE data=?;',[item.nextSibling.textContent], OK());
        });
    }
}

function submition(){
    if(document.iform.itext.value != ''){
        var data = document.iform.itext.value;
        insertData(db, data);
        // location.reload();

        return true;
    }
    else{
        return false;
    }
}

function hover(){
    var spans = document.querySelectorAll('.span');
    console.log(spans);
    for(let i = 0; i < spans.length; i++){
        spans[i].addEventListener('click', function () {
            document.getElementById('more_info').style.display = 'flex';
            document.getElementById('more_info').insertAdjacentHTML('afterbegin', `${spans[i].textContent}<button id="x_btn" class="btn" onclick="close_more_info()">X</button>`);

        });
    }
}
function close_more_info(){
    var spans = document.querySelectorAll('.span');
    for(let i = 0; i < spans.length; i++){
        document.getElementById('more_info').style.display = 'none';
        document.getElementById('more_info').innerHTML = "";
}
}
setTimeout(() => { hover() }, 1000);
