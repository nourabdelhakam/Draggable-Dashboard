const list_items = document.querySelectorAll(".list-item");
const lists = document.querySelectorAll(".list");
const clearBtn = document.getElementById('clearBtn');
var cantAccess = false;

const wrapper = document.getElementById('wrapper');

const saveBtn = document.getElementById("saveBtn");
const tempPreview = document.getElementById('tempPreview');
const tempBtn =  document.getElementById('tempBtn');
const previewDiv = document.getElementById('preview');
var dragged = null;
var draggedData= null;
var templateList=[];
var movedFrom = "";
(function() {
	var temp = JSON.parse(localStorage.getItem('template'));
	console.log(temp);
	
	if(temp!= null){
		templateList = temp;
		clearBtn.style.display= 'block';
		var gridWrapper = document.getElementById('gridStack');
		gridWrapper.innerHTML = "";
		for( chart in templateList){
			console.log(templateList[chart]);
			
			var gridItem = document.createElement('div');
			gridItem.className ="grid-stack-item ui-draggable ui-resizable";
			gridItem.setAttribute('data-gs-x', templateList[chart].gridMap.gsX )
			gridItem.setAttribute('data-gs-y', templateList[chart].gridMap.gsY )
			gridItem.setAttribute('data-gs-width', templateList[chart].gridMap.gsWidth )
			gridItem.setAttribute('data-gs-height', templateList[chart].gridMap.gsHeight )
			console.log(templateList[chart].gridMap.gsY);
			
			var itemContent = document.createElement('div');
			itemContent.id = makeid(5);
			itemContent.className = "grid-stack-item-content list cParent ui-draggable-handle";

				gridWrapper.append(gridItem)
				gridItem.append(itemContent)
				var grid = GridStack.init();
				grid.addWidget(gridItem, [templateList[chart].gridMap.gsX, templateList[chart].gridMap.gsY, templateList[chart].gridMap.gsWidth, templateList[chart].gridMap.gsHeight, false])

			draw(itemContent,templateList[chart].data,'chartTemplate-')
		}
		
		
	}
 
 })();
 document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains("clearChart")){
		  var parent = e.target.parentNode
		  var pos = e.target.dataset.pos;
		  console.log(parent);
		  console.log(pos);
		  
		  parent.innerHTML='';
		  var filterd = templateList.filter(obj => {
              console.log(obj.id);
              console.log('canvas-'+pos);
              
			return obj.id != 'canvas-'+pos
		  })
		  templateList = filterd;
		  parent.style.backgroundColor = '#FAFBFB'

		  		  
     }
 });
 clearBtn.addEventListener('click',function () {
	 cParent = document.getElementsByClassName('cParent')
	 localStorage.removeItem('template')
	 for( i=0; i< cParent.length; i++ )
{
 var childDiv = cParent[i];
 cParent[i].innerHTML=""
 cParent[i].style.backgroundColor = '#FAFBFB'
 
}
	 clearBtn.style.display = 'none';
	 templateList = []
 })
saveBtn.addEventListener("click", function () {
  var template = localStorage.getItem("template");
	
  if (template)
    var c = confirm("There is a saved template, Do you want to overwrite it?");


  if (c == true || !template) {
	  
	let itemsArray = JSON.stringify(templateList);
	localStorage.setItem("template", itemsArray);
	tempBtn.style.display = "block"

	// tempPreview.innerHTML = wrapper;
  }
});



 tempBtn.addEventListener('click',function(){
	itemsArray = JSON.parse(localStorage.getItem('template'));
	previewDiv.innerHTML = itemsArray;
})



let draggedItem = null;

for (let i = 0; i < list_items.length; i++) {
  const item = list_items[i];
  item.addEventListener("dragstart", function () {
    draggedItem = item;
	dragged = item.id;
	draggedData =JSON.parse(item.dataset.chart);
	
    setTimeout(function () {
	  item.style.display = "none";
	}, 0);
	// cantAccess = false
  });

  item.addEventListener("dragend", function (e) {
		
	setTimeout(function () {
	  draggedItem.style.display = "block";
    //   draggedItem.style.padding = "0";
    //   draggedItem.style.margin = "0";
      draggedItem.style.height = "100%";
      draggedItem.style.width = "100%";
      draggedItem = null;
	}, 0);
	// cantAccess = false;
  });
}
function dragStartListener(el) {
    el.addEventListener("dragstart", function () {
		movedFrom = el.id
	})
}
function dragOverListener(el) {
    el.addEventListener("dragover", function (e) {
	  e.preventDefault();
    });
}
function dragEnterListener(el) {
    el.addEventListener("dragenter", function (e) {
      e.preventDefault();
	  this.style.backgroundColor = "#FFFFFF";
    });
}
function dragLeaveListener(el) {
    el.addEventListener("dragleave", function (e) {
	  this.style.backgroundColor = "#F9FDFF";	 
    });
}
function dropListener(el) {
    el.addEventListener("drop", function (e) {
        i = {
            id:dragged,
            gridMap:e.toElement.parentElement.dataset,
            pos: e.toElement.id,
            data: draggedData
        }
        var result = templateList.filter(obj => {
          return obj.pos === e.toElement.id
        })
        clearBtn.style.display= 'block';
            templateList.push(i);
          draw(e.toElement,draggedData,'chartTemplate-')
        // this.style.backgroundColor = "#FFFFFF";
      });
}
  for (let j = 0; j < lists.length; j++) {
    const list = lists[j];
    dragStartListener(list);
	dragOverListener(list)
    dragEnterListener(list)
    dragLeaveListener(list)
    dropListener(list)
  }

// GridStack

var grid = GridStack.init({
	
	alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	  navigator.userAgent
	),
	// resizable: {
	//   handles: 'e, se, s, sw, w'
	// },
	removable: '#trash',
	removeTimeout: 100,
	acceptWidgets: '.newWidget'
  });

  grid.on('added removed change', function(e, items) {
	var str = '';
	console.log(e);
	console.log(items);
	
	items.forEach(function(item) { str += ' (x,y)=' + item.x + ',' + item.y; });
	console.log(e.type + ' ' + items.length + ' items:' + str );
  });

  grid.on('dropped', function(event, previousWidget, newWidget) {
      console.log(newWidget);
      
      newWidget.el.textContent = '';
      var itemContent = document.createElement('div');
        itemContent.id = makeid(5);
        itemContent.className = "grid-stack-item-content list cParent ui-draggable-handle";
        newWidget.el.append(itemContent);
        dragStartListener(newWidget.el);
        dragOverListener(newWidget.el)
        dragEnterListener(newWidget.el)
        dragLeaveListener(newWidget.el)
        dropListener(newWidget.el)
        grid.addWidget(newWidget.el,[,,3,3,false,1,,1,,makeid(5)])

      
      
  });

//   var grid = GridStack.init();
//     grid.el.appendChild('<div id="gsi-1" data-gs-x="0" data-gs-y="0" data-gs-width="3" data-gs-height="2" data-gs-auto-position="true"><div class="grid-stack-item-content"></div></div>')
//     grid.makeWidget('#gsi-1');
    // var newWidget = document.getElementsByClassName('newWidget');
    // newWidget.id = makeid(5);


  grid.on('gsresizestop', function(event, element) {
	// var newHeight = element.getAttribute('data-gs-height');
	console.log('gsresizestop');
	if(element.getElementsByTagName('canvas')[0]){
	var id = element.getElementsByTagName('canvas')[0].id;
		
		var canvas =document.getElementById(id)
		var chart = JSON.parse(canvas.dataset.chart);
		console.log(canvas.id);
		
		parent = document.getElementById(canvas.parentElement.id);
		canvas.parentNode.textContent ="";	
		console.log(templateList[0].data.id);
		
		draw(parent,chart,'chartTemplate-')
	}
  });

    // TODO: switch jquery-ui out
  $('.newWidget').draggable({
	revert: 'invalid',
	scroll: false,
	appendTo: 'body',
	helper: 'clone'
  });


  function createGridItem(params) {
      
  }