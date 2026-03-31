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
    .controller("editRecordC3Gauge100Ctrl", editRecordC3Gauge100Ctrl);

  editRecordC3Gauge100Ctrl.$inject = [
    "$scope",
    "config",
    "$uibModalInstance",
    "Field",
    "recordC3GaugeSample",
    "cseJSUtil_v2",
    "cseFormEntityService_v2",
    "cseMonacoEditor_jsonjinja",
  ];

  function editRecordC3Gauge100Ctrl(
    $scope,
    config,
    $uibModalInstance,
    Field,
    recordC3GaugeSample,
    cseJSUtil_v2,
    cseFormEntityService_v2,
    cseMonacoEditor_jsonjinja,
  ) {
    $scope.config = config;
    $scope.form_body_uid = "cse-" + crypto.randomUUID();

    $scope.getObjectKeyLength = cseJSUtil_v2.getObjectKeyLength;
    $scope.getObjectKeySorted = cseJSUtil_v2.getObjectKeySorted;

    $scope.$on("$destroy", function () {
      $scope.$broadcast("$destory");
    });

    // -------------------------------------------------------- Title Start  --------------------------------------------------------
    config.title = config.title ?? "";
    $scope.data_cs_title = new Field({
      name: "data_cs_title",
      formType: "text",
      title: "Title",
      writeable: true,
      validation: {
        required: false,
      },
    });

    config.title_show = config.title_show ?? false;
    // -------------------------------------------------------- Title End  --------------------------------------------------------

    // -------------------------------------------------------- Form Entity Service Start  --------------------------------------------------------
    const csefes = cseFormEntityService_v2.init_edit($scope);
    // console.log("csefes.scopeDat", csefes.scopeDat);
    // console.log("csefes.configDat", csefes.configDat);

    $scope.chart_values = {};
    $scope.$on(`csefes_updated_fields`, (event, data) => {
      for (const [key, value] of Object.entries(data)) {
        if (Object.hasOwn(csefes.configDat.monitored_fields, key))
          chart_values[key] = value;
      }
    });
    // -------------------------------------------------------- Form Entity Service End  --------------------------------------------------------

    // -------------------------------------------------------- Monaco Editor Start  --------------------------------------------------------
    $scope.csemonaco = $scope?.csemonaco ?? {};
    config.csemonaco = config?.csemonaco ?? {};

    // firt editor (for base)
    const eid_0 = "e0";
    $scope.csemonaco[eid_0] = $scope?.csemonaco?.[eid_0] ?? {};
    config.csemonaco[eid_0] = config?.csemonaco?.[eid_0] ?? {};
    $scope.csemonaco[eid_0].id = "monaco-" + crypto.randomUUID();

    const eid_1 = "e1";
    $scope.csemonaco[eid_1] = $scope?.csemonaco?.[eid_1] ?? {};
    config.csemonaco[eid_1] = config?.csemonaco?.[eid_1] ?? {};
    $scope.csemonaco[eid_1].id = "monaco-" + crypto.randomUUID();

    cseJSUtil_v2.waitForElements([`#${$scope.csemonaco[eid_0].id}`, `#${$scope.csemonaco[eid_1].id}`]).then(() => {
      $scope.csemonaco[eid_0].editor = cseMonacoEditor_jsonjinja.create_editor(
        $scope.csemonaco[eid_0].id,
        "json-jinja",
      );

      $scope.csemonaco[eid_1].editor = cseMonacoEditor_jsonjinja.create_editor(
        $scope.csemonaco[eid_1].id,
        "json-jinja",
      );

      if (!config.csemonaco[eid_0].content && !config.csemonaco[eid_1].content)
        $scope.bt_reset_chart_template();
      else {
        config.csemonaco[eid_0].content = config.csemonaco[eid_0]?.content ?? "";
        $scope.csemonaco[eid_0].editor.setValue(config.csemonaco[eid_0].content)
        
        config.csemonaco[eid_1].content = config.csemonaco[eid_1]?.content ?? "";
        $scope.csemonaco[eid_1].editor.setValue(config.csemonaco[eid_1].content)
      }
    });

    $scope.bt_reset_chart_template = function () {
      config.csemonaco[eid_0].content = JSON.stringify(
        recordC3GaugeSample.getBaseSample(),
        null,
        2,
      );
      $scope.csemonaco[eid_0].editor.setValue(config.csemonaco[eid_0].content);

      config.csemonaco[eid_1].content = JSON.stringify(
        recordC3GaugeSample.getAnimateSample(),
        null,
        2,
      );
      $scope.csemonaco[eid_1].editor.setValue(config.csemonaco[eid_1].content);

      return "";
    };

    $scope.bt_clear_chart_template = function () {
      config.csemonaco[eid_0].content = "";
      $scope.csemonaco[eid_0].editor.setValue(config.csemonaco[eid_0].content);

      config.csemonaco[eid_1].content = "";
      $scope.csemonaco[eid_1].editor.setValue(config.csemonaco[eid_1].content);
    };

    $scope.bt_render_chart_template = function () {
      config.csemonaco[eid_0].content =
        $scope.csemonaco[eid_0].editor.getValue();

      config.csemonaco[eid_1].content =
        $scope.csemonaco[eid_1].editor.getValue();

      // run base template
      cseJSUtil_v2
        .jinja(config.csemonaco[eid_0].content, $scope.chart_values)
        .then((data) => {
          const chart_data = data.result;
          // console.debug(chart_data);
          chart_data.bindto = document.getElementById($scope.chart_uid);
          $scope.chart = c3.generate(chart_data);

          // run animate template

          cseJSUtil_v2
            .jinja(config.csemonaco[eid_1].content, $scope.chart_values)
            .then((data) => {
                $scope.chart.load(data.result);
            });
        });
    };

    // second editor (for animation)
    // -------------------------------------------------------- Monaco Editor End  --------------------------------------------------------

    // -------------------------------------------------------- Chart Start  --------------------------------------------------------
    $scope.chart_uid = "chart-" + crypto.randomUUID();
    // -------------------------------------------------------- Chart End  --------------------------------------------------------

    // -------------------------------------------------------- UI start  --------------------------------------------------------
    $scope.bt_cancel = bt_cancel;
    $scope.bt_save = bt_save;

    function bt_cancel() {
      $uibModalInstance.dismiss("cancel");
    }

    function bt_save() {
      // added to save monaco data.
      config.csemonaco[eid_0].content =
        $scope.csemonaco[eid_0].editor.getValue();
      config.csemonaco[eid_1].content =
        $scope.csemonaco[eid_1].editor.getValue();

      if ($scope.editWidgetForm.$invalid) {
        $scope.editWidgetForm.$setTouched();
        $scope.editWidgetForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
    // -------------------------------------------------------- UI end  --------------------------------------------------------
  }
})();
