var searchObj={
    dataurl: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
    imgurl: 'https://maps.googleapis.com/maps/api/place/photo',
    language:"zh-CN",
    types:"bar"
};

var joindata={};

search=function(){
    var mysearch=$.trim($("#mysearch").val());
    if(mysearch){
        sessionStorage.lastsearch=mysearch;
        sessionStorage.bars=JSON.stringify([]);
        $('#pois').empty(); // 先清空
        getAllBars(mysearch);
    }else{
        alert("你想到空灵的地方？否则怎么搜索的内容为空！请验证输入！");
    }
}

// 获取酒吧数据
getAllBars=function(mysearch){ 
    var _url="/search/"+ mysearch;
    $.getJSON( _url,
         showBars
    );
};


showBars=function(data){
    var bars=[];
    if(data){
        var bars = data;
        sessionStorage.bars=JSON.stringify(bars);
    }else{
        if(sessionStorage.bars){
            bars=JSON.parse(sessionStorage.bars);
        }
    }
    var joinq=[];
    $('#pois').empty(); // 先清空
    if(bars.length>0){
        for(var i=0;i<bars.length;i++){
            var placeid=bars[i].id
            joinq.push(placeid);
            var html = '<div class="row bars">';
            html += "<div class='mylabel'><span class='barname'>"+bars[i].name+"</span></div>";
            html += "<div class='mylabel'>地址:<span class='baraddress'>"+(bars[i].location.formattedAddress).join(" ")+"</span></div>";
            html += "<div class='mylabel'>去玩的有<spand class='barjion' id='show-"+placeid+"'>0</spand>人 <button class='bt-join bt-disabled' onclick='updatejoin(\""+placeid+"\")'>加入/不去了</button></div>";
            html += '</div>';
            $('#pois').append(html);
        }
    }else{
         $('#pois').html("<div class='warnshow'>没有搜索到合适的酒吧！</div>");
    }
    if(myID){//登录用户允许加入
        $(".bt-join").removeClass("bt-disabled")
    }
    sessionStorage.joinq=JSON.stringify(joinq);
    getJoinBarData()
};

updatejoin=function(id){
    // 更新一个 酒吧 加入情况
    console.log(id);
    var _url="/updatebar/"+ id;
    $.getJSON( _url,
        function(data){
            console.log("2:"+id);
            showJoin(data)
        }
        
    );
}
getJoinBarData=function(q){
    var joinq=JSON.parse(sessionStorage.joinq);
    var id=joinq.shift();
    sessionStorage.joinq=JSON.stringify(joinq);
    var _url="/getjoin/"+ id;
    $.getJSON( _url,
        function(data){
            console.log("now："+id)
            showJoin(data);
        }
        
    );
    if(joinq.length){
        getJoinBarData();//递归调用直到查询完
    }else{
        console.log("getJoinBarData end")
    }
}
showJoin=function(data){
    /*
    data={id1:[user1,user2],id2:[user1,user2]...}
     */
_.forOwn(data, function(v, k) {
  $("#show-"+k).html(v.length);
});
    
}


