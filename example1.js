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
  }
};


function init(){
    //init data
  var json = {
    id: "1",
    name: "Higgs Boson",
    children: [{
      id: "2",
      name: "Particle physics",
      data: {
        $dim: 9,
      }
    }, {
      id: "3",
      name: "Standard Model",
      data: {
        $dim: 8
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

  //init RGraph
  var rgraph = new $jit.RGraph({
    //Where to append the visualization
    injectInto: 'infovis',
    //Optional: create a background canvas that plots
    //concentric circles.
    background: {
      CanvasStyles: {
        strokeStyle: '#555'
      }
    },
    //Add navigation capabilities:
    //zooming by scrolling and panning.
    Navigation: {
      enable: true,
      panning: true,
      zooming: 10
    },
    //Set Node and Edge styles.
    Node: {
      color: '#ddeeff',
      overridable: true
    },

    Edge: {
      color: '#C17878',
      lineWidth:1.5
    },

    levelDistance: 200,

    //Add the name of the node in the correponding label
    //and a click handler to move the graph.
    //This method is called once, on label creation.
    onCreateLabel: function(domElement, node){
      domElement.innerHTML = node.name;
      domElement.onclick = function(){
        rgraph.onClick(node.id, {
          onComplete: function() {
            Log.write("done");
          }
        });
      };
    },
    //Change some label dom properties.
    //This method is called each time a label is plotted.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      style.display = '';
      style.cursor = 'pointer';

      if (node._depth <= 1) {
        style.fontSize = "0.8em";
        style.color = "#ccc";

      } else if(node._depth == 2){
        style.fontSize = "0.7em";
        style.color = "#494949";

      } else {
        style.display = 'none';
      }

      var left = parseInt(style.left);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.marginTop = 10 + 'px';
    }
  });
  //load JSON data
  rgraph.loadJSON(json);
  //trigger small animation
  rgraph.graph.eachNode(function(n) {
    var pos = n.getPos();
    pos.setc(-200, -200);
  });
  rgraph.compute('end');
  rgraph.fx.animate({
    modes:['polar'],
    duration: 2000
  });
  //end
}
