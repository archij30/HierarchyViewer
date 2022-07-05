import angular from "angular";
angular.module("app", []);
angular.module("app").directive("node", function () {
  return {
    restrict: "E",
    controller: function ($scope) {
      var ctrl = this;
      ctrl.childMetaData = {
        depth: $scope.depth - 1,
        level: $scope.level + 1
      };

      $scope.render = function () {
        if (ctrl.childMetaData.level === $scope.lastlevel) {
          console.log("calling render");
          ctrl.childMetaData.depth = 1;
          $scope.lastlevel++;
        }
      };
      console.log($scope.nodedata);
    },
    controllerAs: "ctrl",
    template: `<div class="node-container" data-level="level" data-id="nodedata.id">
      <div class="node">{{nodedata.id}}</div>
      <div class="children-container">
        <node ng-if="ctrl.childMetaData.depth > 0" ng-repeat="child in nodedata.children" nodedata="child" depth="ctrl.childMetaData.depth" level="ctrl.childMetaData.level" lastlevel="lastlevel" render="render"></node>
      </div>
    </div>`,
    scope: {
      nodedata: "=",
      depth: "=",
      level: "=",
      lastlevel: "=",
      render: "=?"
    }
  };
});
angular.module("app").controller("MyController", function () {
  var ctrl = this;
  class Node {
    constructor(val) {
      this.id = val;
      this.children = [];
    }
  }
  ctrl.DATA_CACHE = {};
  ctrl.lastLevel = -1;
  ctrl.maxLevel = 0;
  const createTreeData = function (level, root, val, n) {
    if (level === 0) {
      return root;
    }
    if (!root) {
      root = new Node(String(val));
    }
    root.children = new Array(n).fill(null);
    for (let i = 0; i < n; i++) {
      root.children[i] = createTreeData(
        level - 1,
        root.children[i],
        val + 1,
        n
      );
    }
    ctrl.DATA_CACHE[root.id] = root;
    ctrl.maxLevel = Math.max(ctrl.maxLevel, level);
    return root;
  };
  ctrl.metaData = {
    depth: 5,
    level: 0,
    render: () => {}
  };
  ctrl.hierarchyData = null;
  ctrl.hierarchyData = createTreeData(100, ctrl.hierarchyData, 0, 1);
  console.log(ctrl.hierarchyData);

  const onscroll = function () {
    if (this.oldScroll <= this.scrollY) {
      if (
        window.scrollY + window.innerHeight + 300 >=
        document.documentElement.scrollHeight
      ) {
        ctrl.metaData.render();
        console.log("scroll down");
      }
    } else if (
      window.scrollY + window.innerHeight + 100 <
      document.documentElement.scrollHeight
    ) {
      // console.log(ctrl.lastLevel);
      // removeNodes();
      console.log("scroll up");
    }
    this.oldScroll = this.scrollY;
  };
  const addEvent = function () {
    window.addEventListener("scroll", onscroll);
  };

  addEvent();
});

// Manually bootstrap your angular application
angular.bootstrap(document.getElementById("root"), ["app"]);
