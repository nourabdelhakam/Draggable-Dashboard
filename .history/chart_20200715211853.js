function draw(el, chart, type,id = null) {
    // var el = document.getElementById(pos);
   var pos = makeid(5);
    var canvas = document.createElement("canvas");
    canvas.className = "list-item";
    canvas.setAttribute("draggable", "true");
    canvas.setAttribute("data-chart", JSON.stringify(chart));
    console.log(el);
    
    canvas.id = 'canvas-'+pos;
    if(type == 'chartTemplate-'){
        
       var clear = document.createElement('button');
       clear.innerHTML ='x';
       clear.className = 'clearChart';
       clear.id = 'clear-'+pos;
       clear.setAttribute('data-pos',pos);
       el.append(clear)
    }
    el.append(canvas);
    canvas.style.height='100%'
    
  
    c = document.getElementById('canvas-'+pos).getContext("2d");
    
    new Chart(c, {
      type: chart.type,
      data: {
        labels: chart.labels,
        datasets: [
          {
            data: chart.data,
            backgroundColor: chart.colors,
          },
        ],
      },
      options: {
        title: {
          Text: "Do you like doughnuts?",
          display: true,
        },
        layout: {
          padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
          },
          margin: {
              right:0,
              left:0,
              top:0,
              bottom:0
          },
          
      }
      },
    });
  }
  
  exports = draw;
  
  // let myChart1 = document.getElementById("myChart").getContext('2d');
  let chartWrapper = document.getElementById("chartList");
  
  for (let chart in chartData) {
  
    draw(chartWrapper, chartData[chart],'chatLib-');
  }
  
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  