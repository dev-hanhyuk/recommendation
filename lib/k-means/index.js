
function KMeans(opts) {
  if (!(this instanceof KMeans)) return new KMeans(opts);
  opts = opts || {};

  this.k = opts.k;//number of cluster centroids
  this.data = opts.data;//points to cluster
  this.assignments = [];// keeps track of which cluster centroid index each data belongs to
  this.extents = this.dataDimensionExtents();// (min, max) for the dimensions
  this.ranges = this.dataExtentRanges(); //range of the dimensions
  this.means = this.seeds(); //generate random cluster centroid points
  this.iterations = 0; //keep track of number of times centroids move

  /* Canvas related */
  // this.canvas = opts.canvas;
  // this.context = this.canvas.getContext('2d');
  // this.width = this.canvas.width;
  // this.height = this.canvas.height;
  // this.clusterColors = this.clusterColors(); //generate cluster colors
  //clear the canvas
  // this.context.fillStyle = 'rgba(255, 255, 255)';
  // this.context.fillRect(0, 0, this.width, this.height);
  // this.draw(); // draw the points onto canvas
  // this.drawDelay = 20; //delay for each draw iterations

  this.run();
}


//[{min: 2, max: 4}, {min: 1, max: 7}]
KMeans.prototype.dataDimensionExtents = function() {
  data = data || this.data;
  let extents = [];

  for (var i=0; i<data.length; i++) {
    var point = data[i];

    for (var j=0; j < point.length; j++) {
      if (!extents[j]) extents[j] = { min: 1000, max: 0};
      if (point[j] < extents[j].min) extents[j].min = point[j];
      if (point[j] > extents[j].max) extents[j].max = point[j];
    }
  }

  return extents;
}

KMeans.prototype.dataExtentRanges = function() {
  let ranges = [];
  for (var i=0; i < this.extents.length; i++) {
    ranges[i] = this.extents[i].max - this.extents[i].min;
  }
  return ranges;
}

/*
Returns an array of randomly generated cluster centroid points bounds based on the data dimension ranges.
*/
KMeans.prototype.seeds = function() {
  var means = [];
  while (this.k--) {
    var mean = [];

    for (var i=0; i<this.extents.length; i++) {
      mean[i] = this.extents[i].min + (Math.random() * this.ranges[i]);
    }

    means.push(mean);
  }
  return means;
}

/*
Calculate Euclidean distance between each point and the cluster center.
Assigns each point to closest mean point
Euclidean distance
*/

KMeans.prototype.assignClusterToDataPoints = function() {
  let assignments = [];

  for(var i=0; i< this.data.length; i++) {
    var point = this.data[i];
    var distances = [];

    for (var j=0; j < this.means.length; j++) {
      var mean = this.means[j];
      var sum = 0;

      for (var dim = 0; dim < point.length; dim++) {
        var d = point[dim] - mean[dim];
        d = Math.pow(d, 2);

        sum += d;
      }
      distances[j] = Math.sqrt(sum);
    }
    assignments[i] = distances.indexOf(Math.min.apply(null, distances));
  }
  return assignments;
}

/* update the positions of the cluster centroids */
KMeans.prototype.moveMeans = function() {
  var sums = fillArray(this.means.length, 0);
  var counts = fillArray(this.means.length, 0);
  let moved = false;
  let i, meanIndex, dim;

  for (i = 0; i < this.means.length; i++) {
    sums[i] = fillArray(this.means[i].length, 0);
  }

  for (var pointIndex = 0; pointIndex < this.assignments.length; pointIndex++) {
    meanIndex = this.assignments[pointIndex];
    var point = this.data[pointIndex];
    var mean = this.means[meanIndex];

    counts[meanIndex]++;

    for (dim = 0; dim < mean.length; dim++) {
      sums[meanIndex][dim] += point[dim];
    }
  }

  // if cluster centroid is not longer assigned to anypoints, move it somewhere else randomly within range of points

  for (meanIndex = 0; meanIndex < sums.length; meanIndex++) {
    if (0 === counts[meanIndex]) {
      sums[meanIndex] = this.means[meanIndex];

      for (dim = 0; dim < this.extents.length; dim++) {
        sums[meanIndex][dim] = this.extents[dim].min + (Math.random() * this.ranges[dim]);
      }
      continue;
    }

    for (dim = 0; dim < sums[meanIndex].length; dim++) {
      sums[meanIndex][dim] /= counts[meanIndex];
      sums[meanIndex][dim] = Math.round(100 * sums[meanIndex][dim]) / 100;
    }
  }

  //if current mean does not equal to new means, then move cluster centroid closer to average point

  if (this.means.toString() !== sums.toString()) {
    var diff;
    moved = true;

    // Nudge means 1/nth of the way toward average point.
    for (meanIndex = 0; meanIndex < sums.length; meanIndex++) {
      for (dim = 0; dim < sums[meanIndex].length; dim++) {
        diff = (sums[meanIndex][dim] - this.means[meanIndex][dim]);
        if (Math.abs(diff) > 0.1) {
          var stepsPerIteration = 10;
          this.means[meanIndex][dim] += diff / stepsPerIteration;
          this.means[meanIndex][dim] = Math.round(100*this.means[meanIndex][dim]) / 100;
        } else {
          this.means[meanIndex][dim] = sums[meanIndex][dim];
        }
      }
    }
  }

  return moved;
}


KMeans.prototype.run = function() {
  ++this.iterations;

  this.assignments = this.assignClusterToDataPoints();// Reassign points to nearest cluster centroids.
  var meansMoved = this.moveMeans(); //returns bool if the cluster centroid moved

  if (meansMoved) {
    // this.draw();
    this.timer = setTimeout(this.run.bind(this), this.drawDelay);
  } else {
    console.log('iteration took for completion: ' + this.iterations);
  }
}


/**
* fillArray
* @desc Returns a prefilled array.
* @param {number} length - length of array
* @param {*} value - value to prefill with.
* @return array with prefilled values.
*/
function fillArray(length, val) {
  return Array.apply(null, Array(length)).map(function() { return val; });
}





var data = [
  [6,5],
  [9,10],
  [10,1],
  [5,5],
  [7,7],
  [4,1],
  [10,7],
  [6,8],
  [10,2],
  [9,4],
  [2,5],
  [9,1],
  [10,9],
  [2,8],
  [1,1],
  [6,10],
  [3,8],
  [2,3],
  [7,9],
  [7,7],
  [3,6],
  [5,8],
  [7,5],
  [10,9],
  [10,9]
];


var kmeans = new KMeans({
  data: data,
  k: 3
});