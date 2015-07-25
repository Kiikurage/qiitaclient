var View = require('./View.js');

/**
 * Chartを表示するView
 */
function ChartView(base) {
	View.apply(this, arguments);
	this.$.base.classList.add('ChartView');

	extend(this.$, {
		chart: this.$.base.querySelector('.ChartView__svg')
	});

	/**
	 * d3 selection object of <svg>
	 * @type {d3.Selection}
	 * @private
	 */
	this.chart_ = d3.select(this.$.chart);

	/**
	 * the data used to update view last time.
	 * @type {Array<Array<*>>}
	 */
	this.lastData = null;

	/**
	 * the option used to update view last time.
	 * @type {Object}
	 */
	this.lastOptions = null;

	this.update([]);
}
inheritClass(ChartView, View);

//------------------------------------------------------------------------------
// Range Selection

ChartView.prototype.initRangeSelector = function(){
	this.$.chart.addEventListener('mousedown', this.onMouseDown_ = this.onMouseDown_.bind(this));
	this.$.chart.addEventListener('mouseup', this.onMouseUp_ = this.onMouseUp_.bind(this));
};

//------------------------------------------------------------------------------
// Update

/**
 * Update view.
 * @param {Array<Array>} data 2d matrix array
 *      which contain row and column header at 1st row and column
 * @param {Object} [options] options
 * @param {number} [options.xMin] minimum value of x axis
 * @param {number} [options.xMax] maximum value of x axis
 * @param {number} [options.yMin] minimum value of y axis
 * @param {number} [options.yMax] maximum value of y axis
 */
ChartView.prototype.update = function(data, options) {
	if (!data && !options) {
		data = this.lastData;
		options = this.lastOptions;
	}

	var params = this.constructParams_(data, options);

	this.updateNoData(params);
	this.updateGrid_(params);
	this.updateAxis_(params);
	this.updateTickLabel_(params);
	this.updatePlot_(params);

	this.lastData = data;
	this.lastOptions = options;
};

/**
 * construct svg parameters.
 * @param {Array} data data matrix
 * @param {Object} options options
 *
 * @param {number} [options.xMin=0] minimum index of x
 * @param {number} [options.xMax=data.length] maximum index of x
 * @param {number} [options.xTickUnit=1] size between tick labels on x axis
 * @param {number} [options.yMin] minimum value of y axis.
 *	if nothing is passed, value is calculated so that all data is covered.
 * @param {number} [options.yMax] maximum value of y axis
 *	if nothing is passed, value is calculated so that all data is covered.
 * @param {number} [options.yTickUnit=20] size between tick labels on y axis
 * @param {boolean} [options.xAxis=true] if true, x axis is drawn.
 * @param {boolean} [options.yAxis=true] if true, y axis is drawn.
 * @param {boolean} [options.xGrid=true] if true, x grid is drawn.
 * @param {boolean} [options.yGrid=true] if true, y grid is drawn.
 * @param {boolean} [options.xTickLabel=true] if true, tick labels on x axis is drawn.
 * @param {boolean} [options.yTickLabel=true] if true, tick labels on y axis is drawn.
 */
ChartView.prototype.constructParams_ = function(data, options) {
	/**
	 * @TODO
	 * 軸ラベルの大きさに応じたパディングの自動調整
	 */
	var options = extend({
		paddingTop: 16,
		paddingRight: 16,
		paddingBottom: 32,
		paddingLeft: 48,
		fontSize: 12,
		xMin: 0,
		xMax: data.length - 1,
		xTickUnit: 5,
		yMin: null,
		yMax: null,
		yTickUnit: 20,
		xAxis: true,
		yAxis: false,
		xGrid: false,
		yGrid: true,
		xTickLabel: true,
		yTickLabel: true,
		colors: []
	}, options);

	var gcr = this.$.chart.getBoundingClientRect(),
		outerWidth = gcr.width,
		outerHeight = gcr.height,
		innerWidth = outerWidth - options.paddingLeft - options.paddingRight,
		innerHeight = outerHeight - options.paddingTop - options.paddingBottom,
		columns = getColumns(data),
		head = columns[0],
		body = columns.slice(1);

	if (data.length === 0) {
		return {
			isEmpty: true,
			base: [outerWidth, outerHeight],
			axis: [],
			xGrid: [],
			yGrid: [],
			xTickLabel: [],
			yTickLabel: [],
			plots: [],
			colors: []
		};
	}

	var xMinI = options.xMin,
		xMaxI = options.xMax;

	/**
	 * インデックスをずらし、データを 0~xMaxIで表現できるよう正規化
	 */
	body = body.map(function(column) {
		return column.slice(xMinI, xMaxI + 1);
	});
	head = head.slice(xMinI, xMaxI + 1);
	xMaxI -= xMinI;
	xMinI = 0;
	options.xMin = head[xMinI];
	options.xMax = head[xMaxI];

	if (options.yMin === null) {
		options.yMin = d3.min(body, function(d) {
			return d3.min(d);
		});
		options.yMin = Math.floor(options.yMin / options.yTickUnit) * options.yTickUnit;
	}

	if (options.yMax === null) {
		options.yMax = d3.max(body, function(d) {
			return d3.max(d);
		});
		options.yMax = Math.ceil(options.yMax / options.yTickUnit) * options.yTickUnit;
	}

	var x = d3.scale.ordinal()
		.rangePoints([options.paddingLeft, options.paddingLeft + innerWidth])
		.domain(head);

	var y = d3.scale.linear()
		.range([options.paddingTop + innerHeight, options.paddingTop])
		.domain([options.yMin, options.yMax]);

	var axis = [];
	if (options.xAxis) {
		axis.push([x(options.xMin), y(options.yMin), innerWidth, 1]);
	}
	if (options.yAxis) {
		axis.push([x(options.xMin), y(options.yMax), 1, innerHeight]);
	}

	var xGrid = [],
		xi;
	if (options.xGrid) {
		xi = options.xTickUnit - options.xMin % options.xTickUnit;
		while (xi <= xMaxI) {
			xGrid.push([x(head[xi]), y(options.yMax), 1, innerHeight]);
			xi += options.xTickUnit;
		}
	}

	var yGrid = [],
		yn;
	if (options.yGrid) {
		yn = options.yMin + options.yTickUnit;
		while (yn <= options.yMax) {
			yGrid.push([x(options.xMin), y(yn), innerWidth, 1]);
			yn += options.yTickUnit;
		}
	}

	var xTickLabel = [];
	if (options.xTickLabel) {
		xi = -xMinI % options.xTickUnit;
		if (xi < 0) {
			xi += options.xTickUnit;
		}
		while (xi <= xMaxI) {
			xTickLabel.push([x(head[xi]), y(options.yMin) + options.fontSize * 2, head[xi]]);
			xi += options.xTickUnit;
		}
	}

	var yTickLabel = [];
	if (options.yTickLabel) {
		yn = options.yMin;
		while (yn <= options.yMax) {
			yTickLabel.push([x(options.xMin) - options.fontSize, y(yn), yn]);
			yn += options.yTickUnit;
		}
	}

	var lines = body.map(function(column) {
		return column.map(function(value, xi) {
			return [x(head[xi]), y(value)];
		});
	});

	var surfaces = lines.map(function(line) {
		var surface = line.slice(0);
		surface.push(
			[x(options.xMax), y(options.yMin)], [x(options.xMin), y(options.yMin)]
		);

		return surface;
	});

	var plots = lines.map(function(line, i) {
		return {
			line: line,
			surface: surfaces[i],
			color: options.colors[i] || '#000'
		};
	});

	return {
		isEmpty: false,
		base: [outerWidth, outerHeight],
		axis: axis,
		xGrid: xGrid,
		yGrid: yGrid,
		xTickLabel: xTickLabel,
		yTickLabel: yTickLabel,
		plots: plots
	};
};

/**
 * draw axis label
 * @param {Object} params parameters created by ChartView#constructParams_
 */
ChartView.prototype.updateNoData = function(params) {
	var noDataLabel = this.chart_.select('.noDataLabel');
	if (noDataLabel.empty()) {
		if (!params.isEmpty) return;
		noDataLabel = this.chart_.append('text').attr('class', 'noDataLabel');
	}

	if (!params.isEmpty) {
		noDataLabel.remove();
		return;
	}

	noDataLabel.attr({
			'x': params.base[0] / 2,
			'y': params.base[1] / 2,
			'text-anchor': 'middle'
		})
		.text('データがありません');
};

/**
 * draw axis
 * @param {Object} params parameters created by ChartView#constructParams_
 */
ChartView.prototype.updateAxis_ = function(params) {
	var axisGroup = this.chart_.select('.axisGroup');
	if (axisGroup.empty()) {
		axisGroup = this.chart_.append('g').attr('class', 'axisGroup');
	}

	var axises = axisGroup.selectAll('.axis').data(params.axis);
	axises.enter().append('rect').attr('class', 'axis');

	axises
		.transition()
		.attr({
			'x': function(d) {
				return d[0]
			},
			'y': function(d) {
				return d[1]
			},
			'width': function(d) {
				return d[2];
			},
			'height': function(d) {
				return d[3];
			}
		});

	axises.exit().remove();
};

/**
 * draw axis label
 * @param {Object} params parameters created by ChartView#constructParams_
 */
ChartView.prototype.updateTickLabel_ = function(params) {
	var tickLabelGroup = this.chart_.select('.tickLabelGroup');
	if (tickLabelGroup.empty()) {
		tickLabelGroup = this.chart_.append('g').attr('class', 'tickLabelGroup');
	}

	var xTickLabels = tickLabelGroup.selectAll('.xTickLabel').data(params.xTickLabel);
	xTickLabels.enter().append('text').attr('class', 'xTickLabel');
	xTickLabels.attr({
			'x': function(d) {
				return d[0]
			},
			'y': function(d) {
				return d[1]
			},
			'text-anchor': 'middle'
		})
		.text(function(d) {
			return d[2]
		});
	xTickLabels.exit().remove();

	//@TODO コピペをどうにかする

	var yTickLabels = tickLabelGroup.selectAll('.yTickLabel').data(params.yTickLabel);
	yTickLabels.enter().append('text').attr('class', 'yTickLabel');
	yTickLabels.attr({
			'x': function(d) {
				return d[0]
			},
			'y': function(d) {
				return d[1]
			},
			'text-anchor': 'end'
		})
		.text(function(d) {
			return d[2]
		});
	yTickLabels.exit().remove();
};

/**
 * draw axis label
 * @param {Object} params parameters created by ChartView#constructParams_
 */
ChartView.prototype.updateGrid_ = function(params) {
	var xGridGroup = this.chart_.select('.xGridGroup');
	if (xGridGroup.empty()) {
		xGridGroup = this.chart_.append('g').attr('class', 'xGridGroup');
	}

	var xGrids = xGridGroup.selectAll('.xGrid').data(params.xGrid);
	xGrids.enter().append('rect').attr('class', 'xGrid');
	xGrids
		.attr({
			'x': function(d) {
				return d[0];
			},
			'y': function(d) {
				return d[1];
			},
			'width': function(d) {
				return d[2];
			},
			'height': function(d) {
				return d[3];
			}
		});
	xGrids.exit().remove();

	//@TODO コピペをどうにかしたい
	var yGridGroup = this.chart_.select('.yGridGroup');
	if (yGridGroup.empty()) {
		yGridGroup = this.chart_.append('g').attr('class', 'yGridGroup');
	}

	var yGrids = yGridGroup.selectAll('.yGrid').data(params.yGrid);
	yGrids.enter().append('rect').attr('class', 'yGrid');
	yGrids
		.attr({
			'x': function(d) {
				return d[0];
			},
			'y': function(d) {
				return d[1];
			},
			'width': function(d) {
				return d[2];
			},
			'height': function(d) {
				return d[3];
			}
		});
	yGrids.exit().remove();
};

/**
 * draw plot (lines, markers, and fill surfaces)
 * @param {Object} params parameters created by ChartView#constructParams_
 */
ChartView.prototype.updatePlot_ = function(params) {
	var radius = 4;

	var lineFuncs = params.plots.map(function(plot) {
		return d3.svg.line()
			.x(function(d) {
				return d[0];
			})
			.y(function(d) {
				return d[1];
			});
	});

	var plotGroup = this.chart_.selectAll('.plotGroup')
	if (plotGroup.empty()) {
		plotGroup = this.chart_.append('g').attr('class', 'plotGroup');
	}

	var plots = plotGroup.selectAll('.plot').data(params.plots);
	var newPlots = plots.enter().append('g').attr('class', 'plot');
	newPlots.append('path').attr('class', 'surface');
	newPlots.append('path').attr('class', 'line');
	// newPlots.append('g').attr('class', 'markerGroup');

	/**
	 * surface
	 */
	var surfaces = plots.select('.surface').datum(function(d, i) {
		return d;
	});
	surfaces
		.attr({
			'd': function(d, i) {
				return lineFuncs[i](d.surface);
			},
			'fill': function(d, i){
				return d.color;
			}
		});

	/**
	 * line
	 */
	var lines = plots.select('.line').datum(function(d) {
		return d;
	});
	lines
		.attr({
			'd': function(d, i) {
				return lineFuncs[i](d.line);
			},
			'stroke': function(d, i){
				return d.color;
			}
		});

	/**
	 * marker
	 */
	// var markerGroup = plots.select('.markerGroup').datum(function(d) {
	// 	return d.line
	// });
	//
	// var markers = markerGroup.selectAll('.marker').data(function(d) {
	// 	return d;
	// });
	// markers.enter().append('circle').attr('class', 'marker');
	// markers.attr({
	// 	'cx': function(d) {
	// 		return d[0];
	// 	},
	// 	'cy': function(d) {
	// 		return d[1];
	// 	},
	// 	'r': radius
	// });
	//
	// markers.exit().remove();
	plots.exit().remove();
};

/**
 * pick up all columns without row and column header from 2d-array.
 * @param {Array<Array>} data 2d-matrix data.
 * @return {Array<Array} columns
 */
function getColumns(data) {
	return data.reduce(function(res, row, i) {
		row.forEach(function(v, i) {
			return (res.length > i) ?
				res[i].push(v) :
				res.push([v]);
		});

		return res;
	}, []);
}

//------------------------------------------------------------------------------
// Event Handlers

ChartView.prototype.onMouseDown_ =function(ev){
	console.log('mousedown');
};

ChartView.prototype.onMouseUp_ =function(){
	console.log('mouseup');
};

module.exports = ChartView;
