/* 
  author: kimd@fortinet.com
  modified: 250102 
*/
"use strict";

(function () {
    angular.module("cybersponse").factory("recordC3GaugeSample", recordC3GaugeSample);

    recordC3GaugeSample.$inject = [];

    function recordC3GaugeSample() {
        const service = {
            getBaseSample: getBaseSample,
            getAnimateSample: getAnimateSample,
        };

        function getBaseSample() {
            // usage: set bindto, c3.generate(getBaseSample());

            return {
                data: {
                    columns: [
                        ['data', 91.4]
                    ],
                    type: 'gauge',
                },
                gauge: {
                },
                color: {
                    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
                    threshold: {
                        values: [30, 60, 90, 100]
                    }
                },
                size: {
                    height: 180
                }
            }
        }

        function getAnimateSample() {
            //usage: chart.load(getAnimateSample());

            return {
                columns: [['data', 10]]
            }
        }

        return service;
    }
})();
