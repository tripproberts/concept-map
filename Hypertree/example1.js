var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
    //init data
    var json = {
      id: "1",
      name: "",
      children: [{
        id: "2",
        name: "Particle physics",
        children: [{
          id: "3",
          name: "Standard Model",
          data: {
            $dim: 8
          }
        }, {
          id: "23",
          name: "Test Model",
          data: {
            $dim: 8
          }
        }],
        data: {
          $dim: 9,
        }
      }, {
        id: "4",
        name: "Elementary particle",
        data: {
          $dim: 8
        }
      }, {
        id: "5",
        name: "Boson",
        data: {
          $dim: 8
        }
      }, {
        id: "6",
        name: "Large Hadron Collider",
        data: {
          $dim: 7
        }
      }, {
        id: "7",
        name: "W and Z bosons",
        data: {
          $dim: 5
        }
      }, {
        id: "8",
        name: "Higgs mechanism",
        data: {
          $dim: 4
        }
      }, {
        id: "9",
        name: "Spin",
        data: {
          $dim: 2
        }
      }, {
        id: "10",
        name: "Electron",
        data: {
          $dim: 2
        }
        /*}, {
id: "12",
name: "Quark",
data: {
$dim: 1
}
}, {
id: "13",
name: "Fermion",
data: {
$dim: 1
}
}, {
id: "14",
name: "Neutron",
data: {
$dim: 1
}
}, {
id: "15",
name: "Subatomic particle",
data: {
$dim: 1
}
}, {
id: "16",
name: "Atom",
data: {
$dim: 1
}
}, {
id: "17",
name: "Physics",
data: {
$dim: 1
}
}, {
id: "18",
name: "Temperature",
data: {
$dim: 1
}
}, {
id: "19",
name: "Quantum mechanics",
data: {
$dim: 1
}
}, {
id: "20",
name: "Plasma",
data: {
$dim: 1
}
}, {
id: "21",
name: "Photon",
data: {
$dim: 1
}
}, {
id: "22",
name: "Gas",
data: {
$dim: 1
}
}, {
id: "23",
name: "Condensed matter physics",
data: {
$dim: 1
      }
      */
      }]
    };
    //end
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;

    //init Hypertree
    var ht = new $jit.Hypertree({
      //id of the visualization container
      injectInto: 'infovis',
      //canvas width and height
      width: w,
      height: h,
      //Change node and edge styles such as
      //color, width and dimensions.
      Node: {
        dim: 9,
        color: "#f00"
      },
      Edge: {
        lineWidth: 2,
        color: "#088"
      },
      onBeforeCompute: function(node){
        Log.write("centering");
      },
      //Attach event handlers and add text to the
      //labels. This method is only triggered on label
      //creation
      onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
        $jit.util.addEvent(domElement, 'click', function () {
          ht.onClick(node.id, {
            onComplete: function() {
              ht.controller.onComplete();
            }
          });
        });
      },
      //Change node styles when labels are placed
      //or moved.
      onPlaceLabel: function(domElement, node){
        var style = domElement.style;
        style.display = '';
        style.cursor = 'pointer';
        if (node._depth <= 1) {
          style.fontSize = "0.8em";
          style.color = "#ddd";

        } else if(node._depth == 2){
          style.fontSize = "0.7em";
          style.color = "#ddd";

        } else {
          style.display = 'none';
        }

        var left = parseInt(style.left);
        var w = domElement.offsetWidth;
        style.left = (left - w / 2) + 'px';
      },

      onComplete: function(){
        Log.write("done");

        //Build the right column relations list.
        //This is done by collecting the information (stored in the data property) 
        //for all the nodes adjacent to the centered node.
        var node = ht.graph.getClosestNodeToOrigin("current");
        var html = "<h4>" + node.name + "</h4><b>Connections:</b>";
        html += "<ul>";
        node.eachAdjacency(function(adj){
          var child = adj.nodeTo;
          if (child.data) {
            var rel = (child.data.band == node.name) ? child.data.relation : node.data.relation;
            html += "<li>" + child.name + " " + "<div class=\"relation\">(relation: " + rel + ")</div></li>";
          }
        });
        html += "</ul>";
        $jit.id('inner-details').innerHTML = html;
      }
    });
    //load JSON data.
    ht.loadJSON(json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
}
