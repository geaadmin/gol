var gameStatus = {
  started: "started",
  cleared: "cleared",
  paused: "paused" };


var Page = React.createClass({ displayName: "Page",
  componentDidMount: function () {
    this.startSimulating();
  },
  getInitialState: function () {
    return {
      status: gameStatus.started,
      lifeArea: this.getLifeArea(),
      aliveCellsCount: 0,
      generations: 0 };

  },
  render: function () {

    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(Header, { generations: this.state.generations, aliveCellsCount: this.state.aliveCellsCount }), /*#__PURE__*/
      React.createElement(Actions, { clearFunc: this.clear,
        status: this.state.status,
        actionButtonClick: this.actionButtonClick }), /*#__PURE__*/

      React.createElement(Body, { onSquareClick: this.onSquareClick,
        lifeArea: this.state.lifeArea })));


  },
  actionButtonClick: function () {
    var newStatus = this.state.status,
    oldStatus = this.state.status;
    if (oldStatus == gameStatus.started) {
      newStatus = gameStatus.paused;
      clearInterval(this.interval);
    }

    if (oldStatus == gameStatus.paused || oldStatus == gameStatus.cleared) {
      newStatus = gameStatus.started;
      this.startSimulating();
    }

    this.setState({
      status: newStatus });


  },
  clear: function () {
    clearInterval(this.interval);
    this.setState({
      lifeArea: this.getLifeArea(true),
      status: gameStatus.cleared,
      generations: 0 });

  },
  onSquareClick: function (i, j) {
    var arr = this.state.lifeArea;
    arr[i][j].currentValue = true;
    this.setState({
      lifeArea: arr });

  },
  getLifeArea(clearFlag) {
    var balance = clearFlag ? 0 : 2;
    var verticalCellsCount = 45;
    var horizontalCellsCount = 100;
    if (isMobile()) {
      verticalCellsCount = 30;
      horizontalCellsCount = 30;
    }
    var arr = [];

    for (var i = 0; i < verticalCellsCount; i++) {
      var newArr = [];
      for (var j = 0; j < horizontalCellsCount; j++) {
        newArr.push({
          currentValue: !!(Math.floor(Math.random() * 10 + 1) % balance) });

      }
      arr.push(newArr);
    }
    return arr;
  },
  startSimulating: function () {
    var generations = this.state.generations;
    this.interval = setInterval(() => {
      this.simulateStep(generations++);
    }, 100);
  },
  simulateStep: function (generations) {
    var lifeArea = this.state.lifeArea;

    lifeArea.forEach((h, i) => {
      h.forEach((v, j) => {
        var aliveNeighboursCount = this.getLiveNeightboursCount(lifeArea, i, j);

        if (aliveNeighboursCount < 2) {
          v.newValue = false;
        }

        if (aliveNeighboursCount == 3) {
          v.newValue = true;
        }

        if (aliveNeighboursCount > 3) {
          v.newValue = false;
        }

      });
    });

    var aliveCellsCount = 0;
    lifeArea.forEach((h, i) => {
      h.forEach((v, j) => {
        if (v.newValue == false) {
          v.currentValue = false;
        }
        if (v.newValue == true) {
          v.currentValue = true;
        }
        v.newValue = null;

        if (v.currentValue) {
          aliveCellsCount++;
        }
      });
    });

    this.setState({
      lifeArea: lifeArea,
      generations: generations,
      aliveCellsCount: aliveCellsCount });


  },

  getLiveNeightboursCount: function (lifeArea, i, j) {
    var neighbours = [{
      i: i - 1,
      j: j - 1 },
    {
      i: i - 1,
      j: j },
    {
      i: i - 1,
      j: j + 1 },
    {
      i: i,
      j: j - 1 },
    {
      i: i,
      j: j + 1 },
    {
      i: i + 1,
      j: j - 1 },
    {
      i: i + 1,
      j: j },
    {
      i: i + 1,
      j: j + 1 }];

    var vCellsCount = lifeArea.length;
    var hCellsCount = lifeArea[0].length;

    neighbours.forEach(n => {
      if (n.j < 0) n.j = hCellsCount - 1;
      if (n.i < 0) n.i = vCellsCount - 1;

      n.j = n.j % hCellsCount;
      n.i = n.i % vCellsCount;
    });

    var counter = 0;

    neighbours.forEach(n => {
      if (lifeArea[n.i][n.j].currentValue) {
        counter++;
      }
    });

    return counter;
  } });



var Header = React.createClass({ displayName: "Header",
  render: function () {
    return /*#__PURE__*/(
      React.createElement("div", { className: "header" }, /*#__PURE__*/


      React.createElement("h5", null, "Generations - ", this.props.generations, " \xA0\xA0\xA0   Alive  - ", this.props.aliveCellsCount)));





  } });


var Actions = React.createClass({ displayName: "Actions",
  render: function () {
    var firstButtonIcon;
    var firstButtonText;
    console.log(this.props.status);
    //play_arrow
    if (this.props.status == gameStatus.started) {
      firstButtonText = "pause";
      firstButtonIcon = "pause";
    }

    if (this.props.status == gameStatus.paused) {
      firstButtonText = "resume";
      firstButtonIcon = "play_arrow";
    }

    if (this.props.status == gameStatus.cleared) {
      firstButtonText = "start";
      firstButtonIcon = "play_arrow";
    }

    return /*#__PURE__*/(
      React.createElement("div", { className: "actions" }, /*#__PURE__*/

      React.createElement("a", { onClick: this.actionButtonClick, className: "teal darken-2 waves-effect waves-light btn" }, /*#__PURE__*/React.createElement("i", { className: "material-icons left " }, firstButtonIcon), firstButtonText), /*#__PURE__*/

      React.createElement("a", { onClick: this.clearFunc, className: "waves-effect waves-light teal darken-2 btn" }, /*#__PURE__*/React.createElement("i", { className: "material-icons left" }, "clear_all"), "Clear")));


  },
  clearFunc: function () {
    this.props.clearFunc();
  },

  actionButtonClick: function () {
    this.props.actionButtonClick();
  } });


var Body = React.createClass({ displayName: "Body",
  render: function () {
    var squareWidth = 13;
    if (isMobile()) {
      squareWidth = 10;
    }
    return /*#__PURE__*/(
      React.createElement("div", { className: "body" }, /*#__PURE__*/
      React.createElement("div", { className: "svg-wrapper" }, /*#__PURE__*/
      React.createElement("svg", { width: squareWidth * this.props.lifeArea[0].length,
        height: squareWidth * this.props.lifeArea.length },


      this.props.lifeArea.map((h, i) => {
        return h.map((v, j) => {
          return /*#__PURE__*/React.createElement("rect", { onClick: this.onSquareClick.bind(null, { i: i, j: j }),
            width: squareWidth,
            height: squareWidth,
            x: j * squareWidth,
            y: i * squareWidth,
            fill: v.currentValue ? "#00796b" : "white",
            stroke: "black" });

        });
      })))));





  },
  onSquareClick: function (param) {
    this.props.onSquareClick(param.i, param.j);
  } });


ReactDOM.render( /*#__PURE__*/
React.createElement(Page, null), document.getElementById('content'));


function isMobile() {
  return window.innerWidth < 400;
}