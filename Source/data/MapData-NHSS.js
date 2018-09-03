var canonnEd3d_nhss = {

	//Define Categories
	systemsData: {
		"categories": {
			"POI systems": {
				"100": {
					"name": "Systems",
					"color": "F56D54"
				},
				"102": {
					"name": "Other",
					"color": "F79F8F"
				}
			},
			"The Gnosis": {
				"101": {
					"name": "Current System",
					"color": "FF9D00"
				}
			},
			"Non-Human Signal Source - (NHSS)":  {
                "1400": {
                    "name": "Threat Level 2",
                    "color": "99b433"
                },
                "1401": {
                    "name": "Threat Level 3",
                    "color": "1e7145"
                },
                "1402": {
                    "name": "Threat Level 4",
                    "color": "ff0097"
                },
                "1403": {
                    "name": "Threat Level 5",
                    "color": "b91d47"
                },
                "1404": {
                    "name": "Threat Level 6",
                    "color": "e3a21a"
                },
                "1405": {
                    "name": "Threat Level 7",
                    "color": "603cba"
                },
                "1406": {
                    "name": "Threat Level 8",
                    "color": "da532c"
                },
                "1407": {
                    "name": "Threat Level Unknown",
                    "color": "8B0000"
                }
            }
		},
		"systems": []
	},

	formatNHSS: function (data) {
        //Here you format BN JSON to ED3D acceptable object

        // this is assuming data is an array []
        for (var i = 0; i < data.length; i++) {
            if (data[i].System && data[i].System.replace(" ", "").length > 1) {
                var nhssSite = {};
                nhssSite["name"] = data[i].System;

				// Check Threat Level and apply group
				if (data[i].Threat.toString() == "2") {
					nhssSite["cat"] = [1400];
				} else if (data[i].Threat.toString() == "3") {
					nhssSite["cat"] = [1401];
				} else if (data[i].Threat.toString() == "4") {
					nhssSite["cat"] = [1402];
				} else if (data[i].Threat.toString() == "5") {
					nhssSite["cat"] = [1403];
				} else if (data[i].Threat.toString() == "6") {
					nhssSite["cat"] = [1404];
				} else if (data[i].Threat.toString() == "7") {
					nhssSite["cat"] = [1405];
				} else if (data[i].Threat.toString() == "8") {
					nhssSite["cat"] = [1406];
				} else {
					nhssSite["cat"] = [1407];
				}

                nhssSite["coords"] = {
                    "x": parseFloat(data[i].x),
                    "y": parseFloat(data[i].y),
                    "z": parseFloat(data[i].z)
                };

                // We can then push the site to the object that stores all systems
                canonnEd3d_nhss.systemsData.systems.push(nhssSite);
            }
        }
    },

	formatPOI: function (data) {
		//Here you format POI & Gnosis JSON to ED3D acceptable object

		// this is assuming data is an array []
		for (var i = 0; i < data.length; i++) {
			if (data[i].system && data[i].system.replace(" ", "").length > 1) {
				var poiSite = {};
				poiSite["name"] = data[i].system;

				//Check Site Type and match categories
				if (data[i].type.toString() == "gnosis") {
					poiSite["cat"] = [101];
				} else if (data[i].type.toString() == "POI") {
					poiSite["cat"] = [100];
				} else {
					poiSite["cat"] = [102];
				}
				poiSite["coords"] = {
					"x": parseFloat(data[i].galacticX),
					"y": parseFloat(data[i].galacticY),
					"z": parseFloat(data[i].galacticZ)
				};

				// We can then push the site to the object that stores all systems
				canonnEd3d_nhss.systemsData.systems.push(poiSite);
			}

		}

	},

	parseData: function (url, callBack, resolvePromise) {
		Papa.parse(url, {
			download: true,
			header: true,
			complete: function (results) {

				callBack(results.data);

				// after we called the callback
				// (which is synchronous, so we know it's safe here)
				// we can resolve the promise

				resolvePromise();
			}
		});
	},

	init: function () {

		//NHSS Sites
		var p1 = new Promise(function (resolve, reject) {
			canonnEd3d_nhss.parseData("https://docs.google.com/spreadsheets/d/e/2PACX-1vROqL6zifWWxcwlZ0R6iLvrMrUdfJijnMoZee-SrN0NVPqhTdH3Zdx6E7RxP1wH2xgwfrhwfVWUHnKU/pub?gid=1590459372&single=true&output=csv", canonnEd3d_nhss.formatNHSS, resolve);
		});

		//POI & Gnosis
		var p2 = new Promise(function (resolve, reject) {
			canonnEd3d_nhss.parseData("data/csvCache/poiDataCache.csv", canonnEd3d_nhss.formatPOI, resolve);
		});

		Promise.all([p1, p2]).then(function () {
			Ed3d.init({
				container: 'edmap',
				json: canonnEd3d_nhss.systemsData,
				withFullscreenToggle: false,
				withHudPanel: true,
				hudMultipleSelect: true,
				effectScaleSystem: [20, 500],
				startAnim: false,
				showGalaxyInfos: true,
				cameraPos: [25, 14100, -12900],
				systemColor: '#FF9D00'
			});
		});
	}
};