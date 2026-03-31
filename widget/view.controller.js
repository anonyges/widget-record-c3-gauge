/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
/* 
  author: kimd@fortinet.com
  modified: 260223
*/
"use strict";
(function () {
  angular
    .module("cybersponse")
    .controller("recordC3Gauge100Ctrl", recordC3Gauge100Ctrl);

  recordC3Gauge100Ctrl.$inject = [
    "$scope",
    "config",
    "FormEntityService",
    "cseJSUtil_v2",
    "cseFormEntityService_v2",
  ];

  function recordC3Gauge100Ctrl(
    $scope,
    config,
    FormEntityService,
    cseJSUtil_v2,
    cseFormEntityService_v2,
  ) {
    $scope.config = config;
    $scope.form_body_uid = "cse-" + crypto.randomUUID();

    $scope.getObjectKeyLength = cseJSUtil_v2.getObjectKeyLength;
    $scope.getObjectKeySorted = cseJSUtil_v2.getObjectKeySorted;

    $scope.$on("$destroy", function () {
      $scope.$broadcast("$destory");
    });

    // -------------------------------------------------------- Additional Data  --------------------------------------------------------
    $scope.chart_uid = "chart-" + crypto.randomUUID();
    const fes = FormEntityService.get();

    // -------------------------------------------------------- Form Entity Service Start  --------------------------------------------------------
    const csefes = cseFormEntityService_v2.init_view($scope);

    // getting monitored fields defined in the editcontroller
    $scope.chart_values = {};
    Object.keys(csefes.configDat.monitored_fields).forEach((key) => {
      $scope.chart_values[key] = fes.fields[key].value;
    });

    $scope.$on(`csefes_updated_fields`, (event, data) => {
      for (const [key, value] of Object.entries(data)) {
        if (Object.hasOwn(config.csefes.monitored_fields, key)) {
          // console.log(`${key}: ${value}`);
          $scope.chart_values[key] = value;

          cseJSUtil_v2
            .jinja(config.csemonaco[eid_1].content, $scope.chart_values)
            .then((data) => {
              const chart_data = data.result;
              $scope.chart.load(chart_data);
            });
        }
      }
    });
    // -------------------------------------------------------- Form Entity Service End  --------------------------------------------------------

    const eid_0 = "e0"; // editor ID
    const eid_1 = "e1"; // editor ID

    cseJSUtil_v2.waitForElement(`#${$scope.chart_uid}`).then(() => {
      // render Jinja.
      cseJSUtil_v2
        .jinja(config.csemonaco[eid_0].content, $scope.chart_values)
        .then((data) => {
          const chart_data = data.result;
          // console.debug(chart_data);
          chart_data.bindto = document.getElementById($scope.chart_uid);
          $scope.chart = c3.generate(chart_data);
        });
    });

    function update_chart() {
      $scope.chart_uid;
    }
  }
})();
