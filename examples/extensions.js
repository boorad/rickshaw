
// set up our data series with random data points
var timeInterval = 1; // seconds
var init_pts = 20;
var seriesData = [ [] ];
var random = new Rickshaw.Fixtures.RandomData(timeInterval);

for (var i = 0; i < init_pts; i++) {
    random.addData(seriesData);
}

var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

// instantiate our graph!

var graph = new Rickshaw.Graph( {
    element: document.getElementById("chart"),
    width: 900,
    height: 500,
    renderer: 'line',
    series: [
	{
	    color: palette.color(),
	    data: seriesData[0],
	    name: 'Overall Average'
	}
    ]
} );

graph.render();

var slider = new Rickshaw.Graph.RangeSlider( {
    graph: graph,
    element: $('#slider')
} );

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
    graph: graph
} );

var annotator = new Rickshaw.Graph.Annotate( {
    graph: graph,
    element: document.getElementById('timeline')
} );

var legend = new Rickshaw.Graph.Legend( {
    graph: graph,
    element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
    graph: graph,
    legend: legend
} );

var order = new Rickshaw.Graph.Behavior.Series.Order( {
    graph: graph,
    legend: legend
} );

var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
    graph: graph,
    legend: legend
} );

var smoother = new Rickshaw.Graph.Smoother( {
    graph: graph,
    element: $('#smoother')
} );

var ticksTreatment = 'glow';

var xAxis = new Rickshaw.Graph.Axis.Time( {
    graph: graph,
    ticksTreatment: ticksTreatment
} );

xAxis.render();

var yAxis = new Rickshaw.Graph.Axis.Y( {
    graph: graph,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    ticksTreatment: ticksTreatment
} );

yAxis.render();

var stackRenderer = 'stack';

var renderModeMap = {
    stack: {
	render: 'stack',
	offset: 'zero',
    },
    percent: {
	render: 'stack',
	offset: 'expand',
    },
    stream: {
	renderer: 'stack',
	offset: 'wiggle',
    },
    lines: {
	renderer: 'line',
	interpolation: 'cardinal',
	offset: 'zero'
    },
    curves: {
	renderer: 'stack',
	interpolation: 'cardinal'
    },
    bars: {
	renderer: 'bar',
    },
    step: {
	renderer: 'stack',
	interpolation: 'step-after'
    },
};

var setRenderMode = function(name) {

    var mode = renderModeMap[name];

    if (mode.renderer) {
	graph.setRenderer(mode.renderer);
    }

    if (mode.offset) {
	graph.offset = mode.offset;
    }

    if (mode.interpolation) {
	graph.interpolation = mode.interpolation;
    }

    graph.update();
};

var offset_form = document.getElementById('offset_form');
offset_form.addEventListener("change", function(e) { setRenderMode(e.target.value) }, false);

var renderer_form = document.getElementById('renderer_form');
renderer_form.addEventListener("change", function(e) { setRenderMode(e.target.value) }, false);

// add some data every so often

var messages = [
    "Changed home page welcome message",
    "Minified JS and CSS",
    "Changed button color from blue to green",
    "Refactored SQL query to use indexed columns",
    "Added additional logging for debugging",
    "Fixed typo",
    "Rewrite conditional logic for clarity",
    "Added documentation for new methods"
];

// refresh loop
var refresh = window.setInterval( function() {
    console.log(graph.series);
    random.addData(seriesData);

    var shift = seriesData[0].shift();
//    console.log(shift, seriesData);

    //graph.series[0].data = seriesData[0];
    graph.update();
}, 1000 );

// shut down refresh after a few secs
var cancel_refresh = setTimeout( "window.clearInterval(refresh);", 6000 );

function addAnnotation(force) {
    if (messages.length > 0 && (force || Math.random() >= 0.95)) {
	annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
    }
}

addAnnotation(true);
setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );
