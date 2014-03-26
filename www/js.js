//Define global variables

	//Variable containing an array of objects and their data
		var objects = new Array();

	//Variable containing two arrays of AJAX request trackers
		var ongoing_requests = new Array(Array(), Array());

	//Variable containing an array of page data
		var pages_data = new Array();

	//Variable containing sorting order
		var sorting_order = new Array();

function processPageData(x, page_number){
	return function (returnData){
		//Add page html to array
			pages_data.push(returnData);
		
		//Finish tracking of page AJAX req
			ongoing_requests[0][(x-2)] = false;

		//Update progress
			updateProgress(5+((x-1)/page_number)*10);

		//Check if there are any remaining page requests
			checkPageFetchCompletion();
		}
	}

function checkPageFetchCompletion(){
	
	//Count how many page requests have been completed
		var count = 0;
		for (y = 0; y < ongoing_requests[0].length; y++){
			if (ongoing_requests[0][y] == false){
				count++;
				}
			}

	//Update progress bar
		value = (count / ongoing_requests[0].length) * 15 + 5;
		updateProgress(value);

	//If all pages have been fetched, proceed to process objects
		if (count == ongoing_requests[0].length){
			processObjects();
			}
	}

function processObjects(){
	//Iterate through objects
		for (var k = 0; k < pages_data.length; k++){
			extractObjects(pages_data[k]);
			}
	}

function fetchPages(){
	
	//Track initial AJAX req
		ongoing_requests[0][0] = true;
	
	//Initiate initial AJAX req (first page)
		$.ajax({
			type: "GET",
			url: "http://www.boplats.se/HSS/Object/object_list.aspx?cmguid=4e6e781e-5257-403e-b09d-7efc8edb0ac8&objectgroup=1",
			dataType: 'html',
			cache: true,

			success: function(returnData) {
				updateProgress(5);
				
				//Place data in array
					pages_data[0] = returnData;

				//Fetch additional pages (if applicable)
					page_number = $(returnData).find("span[id=ucNavigationBarSimple_lblNoOfPages]").html().split(" ")[1].split("/");
					page_number = parseInt(page_number[1]);
					i = 2;
					if (page_number > 1){
						for (i = 2; i <= page_number; i++){
							ongoing_requests[0][(i-2)] = true;
							var data = {
								'__EVENTVALIDATION': "/wEWJAKno/nlBwKlwZm8CwKBtOJ/Aq7x3JgDAr3p8rMGAr3p9rMGAr3p6rMGAr3pgrQGAr3phrQGAvDC6boLAsHIjPcNAozF08gNAs3G0Z4EAtj1w90NAqGKwJMJAuLBoJwKApa34usLAom5/K8LAoi3o/cLAtuygvkLAtry0fgLAt30i64LAtzy2q0LAt/ymq8LAsCbzvgLAuSg4vgIAtH23pgMAuXRk/YBAsylk6wMAsyll6wMAsylm6wMAsyl/6sMAsylg6wMAsylh6wMAsyli6wMAsylr6wM0oQogMiWnsp3PFAJXx3P9dzDRXY=",
								'__VIEWSTATE': "/wEPDwULLTEwMTU2MDEzOTYPZBYCZg9kFh4CAQ9kFhJmDw8WBB4EVGV4dAUKSW4gRW5nbGlzaB4LTmF2aWdhdGVVcmwFIS9sYW5nL2NoYW5nZV9sYW5nLmFzcHg/bGFuZz1lbi1VU2RkAgEPDxYEHwAFCFNpdGUgTWFwHwEFES9DTS9zaXRlX21hcC5hc3B4ZGQCAg8PFgQfAAUHQ29va2llcx8BBU4vQ00vVGVtcGxhdGVzL0FydGljbGUvZ2VuZXJhbC5hc3B4P2NtZ3VpZD1hYWYzOGYwNy1hMWE0LTQ3NjUtOTMxZS02OGRiMjQ1MzA3ZGNkZAIDDw8WBB8ABQVQcmVzcx8BBU4vQ00vVGVtcGxhdGVzL0FydGljbGUvZ2VuZXJhbC5hc3B4P2NtZ3VpZD04ZGJhMjg2Mi0wNTg3LTRlZmItOGMwOC02MWUwOGI2MWFhZmVkZAIEDw8WBB8ABQlUeWNrIHRpbGwfAQUWL2NvbnRhY3QvZmVlZGJhY2suYXNweGRkAgcPDxYCHgdUb29sVGlwBStBbmdlIHPDtmt1dHRyeWNrIG9jaCBrbGlja2EgcMOlIDxiPlPDtms8L2I+ZGQCCQ8WAh4FdmFsdWUFBFPDtmtkAgwPFgQfAwUITG9nZ2EgaW4eB29uY2xpY2sFUWphdmFzY3JpcHQ6d2luZG93LmxvY2F0aW9uLmhyZWY9Jy91c2VyL2xvZ2luX2hzLmFzcHg/UmV0dXJuVXJsPS9IU1MvRGVmYXVsdC5hc3B4J2QCEQ8PFgQfAAURUmVnaXN0cmVyYSBkaWcgLT4fAQUXL0hTUy9Vc2VyL3JlZ2lzdGVyLmFzcHhkZAICD2QWAmYPZBYCZg88KwAJAQAPFgQeCERhdGFLZXlzFgAeC18hSXRlbUNvdW50AgpkFhRmD2QWAgIBDxYEHgRocmVmBTkvRGVmYXVsdC5hc3B4P2NtZ3VpZD1iYzRhZTNmMy0yOWU0LTQxOTgtODA0Ni1iOTU2MzM4ZmFmOTEeBnRhcmdldGQWAmYPFQEDSGVtZAIBD2QWAgIBDxYEHwcFTi9DTS9UZW1wbGF0ZXMvQXJ0aWNsZS9nZW5lcmFsLmFzcHg/Y21ndWlkPWVlODJmNmU5LWZjYTYtNDU2YS1hNjk3LTAwOTA5NmMzNmUwMR8IZBYCZg8VAQpPbSBCb3BsYXRzZAICD2QWAgIBDxYEHwcFPS9IU1MvRGVmYXVsdC5hc3B4P2NtZ3VpZD1kZWU5YjE2ZC03YjMwLTQ3MGQtYTgwYS01MDg1N2U0YzBjNjEfCGQWAmYPFQEOU8O2ayBsw6RnZW5oZXRkAgMPZBYCAgEPFgQfBwVML0hTTS9FeGNoYW5nZU9iamVjdC9kZWZhdWx0LmFzcHg/Y21ndWlkPTRmNWU1OWI3LTI2ZmMtNDFkMS04YmEzLThiMzhhNzc5OTFlOB8IZBYCZg8VAQxCeXRlc2LDtnJzZW5kAgQPZBYCAgEPFgQfBwVUL0hTTS9TdWJsZXRPYmplY3QvZGVmYXVsdC5hc3B4P2NtZ3VpZD04YzYxYjQ5Zi02NDEzLTRhYzMtOTc1ZS04MWViMzRmNjk2MGMmc3VvdHlwZT0xHwhkFgJmDxUBCUFuZHJhaGFuZGQCBQ9kFgICAQ8WBB8HBUsvSFNTL09iamVjdFByaXZhdGUvZGVmYXVsdC5hc3B4P2NtZ3VpZD00MzdmNzFhNC00NGMyLTQ0MmEtOGViZS1jZDRkMjU4YTVlOTkfCGQWAmYPFQEJS8O2cCBueXR0ZAIGD2QWAgIBDxYEHwcFTi9DTS9UZW1wbGF0ZXMvQXJ0aWNsZS9nZW5lcmFsLmFzcHg/Y21ndWlkPWZkZDc2MjcwLWI3ODAtNGQxYS05OWUwLWNjNWI1Zjc3NWE0MR8IZBYCZg8VAQZTZW5pb3JkAgcPZBYCAgEPFgQfBwVOL0NNL1RlbXBsYXRlcy9BcnRpY2xlL2dlbmVyYWwuYXNweD9jbWd1aWQ9ODRiMDc5NzYtMDZlNy00MzRmLWI1ZjEtMTY5NzM1NWQ2NDVhHwhkFgJmDxUBBlVuZ2RvbWQCCA9kFgICAQ8WBB8HBU4vQ00vVGVtcGxhdGVzL0FydGljbGUvZ2VuZXJhbC5hc3B4P2NtZ3VpZD00ZmEyOTI4MS0yZjkzLTQyM2QtYmM3My1jMjdiYWJiNTU1ZmMfCGQWAmYPFQEHU3R1ZGVudGQCCQ9kFgICAQ8WBB8HBU4vQ00vVGVtcGxhdGVzL0FydGljbGUvZ2VuZXJhbC5hc3B4P2NtZ3VpZD02ZjI1ZDUzYS02OGJhLTQ3ZTQtOTI0Ni0zYTJlZGRhZjYzODcfCGQWAmYPFQEKSHlyZXN2w6RyZGQCBA9kFgICAQ88KwAJAQAPFgQfBRYAHwYCDGQWGGYPZBYCAgEPFgQfCGQfBwVdL3VzZXIvbG9naW5faHMuYXNweD9jbWd1aWQ9ZDc1NjQyNzktYjE3Ni00ZjEzLTkxNzQtM2ZjNmU0NzlhOWE0JlJldHVyblVSTD0uLi9IU1MvRGVmYXVsdC5hc3B4FgQCAQ8PFgQeCEltYWdlVXJsBR0vaW1nL2ljb19hcnJvd19tZW51ZXhwYW5kLmdpZh4HVmlzaWJsZWhkZAICDxUBCExvZ2dhIGluZAIBD2QWAgIBDxYEHwhkHwcFTi9DTS9UZW1wbGF0ZXMvQXJ0aWNsZS9nZW5lcmFsLmFzcHg/Y21ndWlkPTQ1NjFkNjZlLWU5YzYtNDM3OC1iOTlhLTk2ZTcyMjBhNjQzNRYEAgEPDxYEHwkFHS9pbWcvaWNvX2Fycm93X21lbnVleHBhbmQuZ2lmHwpoZGQCAg8VARVQZXJzb251cHBnaWZ0ZXIgKFB1TClkAgIPZBYCAgEPFgQfCGQfBwVDL0hTUy9Vc2VyL3JlZ2lzdGVyLmFzcHg/Y21ndWlkPWE5MGVmZmUzLTFkYWEtNDM2NC1iMmQxLThmODQwODdhNjk0ORYEAgEPDxYEHwkFHS9pbWcvaWNvX2Fycm93X21lbnVleHBhbmQuZ2lmHwpoZGQCAg8VAQ5SZWdpc3RyZXJhIGRpZ2QCAw9kFgICAQ8WBh8IZB8HBVYvSFNTL09iamVjdC9vYmplY3RfbGlzdC5hc3B4P2NtZ3VpZD00ZTZlNzgxZS01MjU3LTQwM2UtYjA5ZC03ZWZjOGVkYjBhYzgmb2JqZWN0Z3JvdXA9MR4Fc3R5bGUFGWJhY2tncm91bmQtY29sb3I6IzBBNDk5NzsWBAIBDw8WBB8JBR0vaW1nL2ljb19hcnJvd19tZW51ZXhwYW5kLmdpZh8KaGRkAgIPFQEYTMOkZ2VuaGV0ZXI6IGFsbGEgbGVkaWdhZAIED2QWAgIBDxYEHwhkHwcFZS9IU1MvT2JqZWN0L29iamVjdF9saXN0LmFzcHg/Y21ndWlkPTE0ODlmNDQ4LWY2MmItNDk1MC04MDE5LWIxNDgwNTE1ZmE1NSZvYmplY3Rncm91cD0xJmFjdGlvbj1ob3RsaXN0FgQCAQ8PFgQfCQUdL2ltZy9pY29fYXJyb3dfbWVudWV4cGFuZC5naWYfCmhkZAICDxUBFkzDpGdlbmhldGVyOiBueWlua29tbmFkAgUPZBYCAgEPFgQfCGQfBwVKL0hTUy9PYmplY3Qvb2JqZWN0X3NlYXJjaC5hc3B4P2NtZ3VpZD1iNDY0NjZiZS03OTcxLTQyZGUtYWQxMy04NDNkOWUwODk5YjgWBAIBDw8WBB8JBR0vaW1nL2ljb19hcnJvd19tZW51ZXhwYW5kLmdpZh8KaGRkAgIPFQEUTMOkZ2VuaGV0ZXI6IHNvcnRlcmFkAgYPZBYCAgEPFgQfCGQfBwVOL0NNL1RlbXBsYXRlcy9BcnRpY2xlL2dlbmVyYWwuYXNweD9jbWd1aWQ9ZDZjZjJjYjYtOGQzYS00ZjcxLTkyY2MtOTQ1NjQ4YzhlMmEyFgQCAQ8PFgQfCQUdL2ltZy9pY29fYXJyb3dfbWVudWV4cGFuZC5naWYfCmhkZAICDxUBGFPDpSBzw7ZrZXIgZHUgaHlyZXNyw6R0dGQCBw9kFgICAQ8WBB8IZB8HBU4vQ00vVGVtcGxhdGVzL0FydGljbGUvZ2VuZXJhbC5hc3B4P2NtZ3VpZD1mYjEwMTdjMC1iMDY2LTQxYjQtYmZmMy0xNDk4MWI3NTM1YTYWBAIBDw8WBB8JBR0vaW1nL2ljb19hcnJvd19tZW51ZXhwYW5kLmdpZh8KaGRkAgIPFQEIT21yw6VkZW5kAggPZBYCAgEPFgQfCGQfBwVOL0NNL1RlbXBsYXRlcy9BcnRpY2xlL2dlbmVyYWwuYXNweD9jbWd1aWQ9YmIwOWMzNDMtYjhhMC00NmFjLTk5NGUtN2ZhYzYwNjhmNDA2FgQCAQ8PFgQfCQUdL2ltZy9pY29fYXJyb3dfbWVudWV4cGFuZC5naWYfCmhkZAICDxUBFlRpcHMgZsO2ciBkZW4gc8O2a2FuZGVkAgkPZBYCAgEPFgQfCGQfBwVIL0hTUy9Vc2VyL3NlbmRfcGFzc3dvcmQuYXNweD9jbWd1aWQ9ZTlkODcxNWQtYjYwYy00ZGU1LTkwOTAtZGY2YTc1MGM3ZjgxFgQCAQ8PFgQfCQUdL2ltZy9pY29fYXJyb3dfbWVudWV4cGFuZC5naWYfCmhkZAICDxUBDkdsw7ZtdCBQSU4ta29kZAIKD2QWAgIBDxYEHwhkHwcFTi9DTS9UZW1wbGF0ZXMvQXJ0aWNsZS9nZW5lcmFsLmFzcHg/Y21ndWlkPTg4OTM1MTQ3LTQwODQtNGEwOC1iM2ExLTQ4M2I1ZjNmNTk4MxYEAgEPDxYEHwkFHS9pbWcvaWNvX2Fycm93X21lbnVleHBhbmQuZ2lmHwpoZGQCAg8VARBPbSBCb3N0YWRzYmlkcmFnZAILD2QWAgIBDxYEHwhkHwcFTi9DTS9UZW1wbGF0ZXMvQXJ0aWNsZS9nZW5lcmFsLmFzcHg/Y21ndWlkPTI1YWQ2Nzk2LWE3OTgtNGZmYi05ODEyLTI1MzUyODJkZTFhMxYEAgEPDxYEHwkFHS9pbWcvaWNvX2Fycm93X21lbnVleHBhbmQuZ2lmHwpoZGQCAg8VARhWYW5saWdhIGZyw6Vnb3Igb2NoIHN2YXJkAgYPDxYCHwpoZGQCCA8PFgIfAAUSTGVkaWdhIGzDpGdlbmhldGVyZGQCCg8WAh8KaBYCZg9kFgJmD2QWBAIDDw8WAh8ABQpIeXJlc3bDpHJkZGQCBQ8QZGQWAGQCDA9kFgZmD2QWDGYPZBYCZg8PFgYfAAURU25hYmIgaW5mbHl0dG5pbmcfAQVTL0NNL1RlbXBsYXRlcy9mYXEuYXNweD9jbWd1aWQ9Zjk5ODAwYTItNDZkNC00MjkzLWE3MTQtOGI3NTlmOWNiYzA5JnFpZD05MDUjb2JqSWQ5MDUeBlRhcmdldAUGX2JsYW5rZGQCAQ9kFgICAQ8PFgYfAQVTL0NNL1RlbXBsYXRlcy9mYXEuYXNweD9jbWd1aWQ9Zjk5ODAwYTItNDZkNC00MjkzLWE3MTQtOGI3NTlmOWNiYzA5JnFpZD05MDUjb2JqSWQ5MDUfAAURU25hYmIgaW5mbHl0dG5pbmcfDAUGX2JsYW5rZGQCAg9kFgJmDw8WBh8ABQ5Lb3J0dGlkc2JvZW5kZR8BBVMvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTkwNiNvYmpJZDkwNh8MBQZfYmxhbmtkZAIDD2QWAgIBDw8WBh8BBVMvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTkwNiNvYmpJZDkwNh8ABQ5Lb3J0dGlkc2JvZW5kZR8MBQZfYmxhbmtkZAIED2QWAmYPDxYGHwAFC1N0dWRlbnRsZ2guHwEFUy9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9OTA3I29iaklkOTA3HwwFBl9ibGFua2RkAgUPZBYCAgEPDxYGHwEFUy9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9OTA3I29iaklkOTA3HwAFC1N0dWRlbnRsZ2guHwwFBl9ibGFua2RkAgIPZBYQZg9kFgJmDw8WBh8ABQxTZW5pb3Jib2VuZGUfAQVTL0NNL1RlbXBsYXRlcy9mYXEuYXNweD9jbWd1aWQ9Zjk5ODAwYTItNDZkNC00MjkzLWE3MTQtOGI3NTlmOWNiYzA5JnFpZD05MDgjb2JqSWQ5MDgfDAUGX2JsYW5rZGQCAQ9kFgICAQ8PFgYfAQVTL0NNL1RlbXBsYXRlcy9mYXEuYXNweD9jbWd1aWQ9Zjk5ODAwYTItNDZkNC00MjkzLWE3MTQtOGI3NTlmOWNiYzA5JnFpZD05MDgjb2JqSWQ5MDgfAAUMU2VuaW9yYm9lbmRlHwwFBl9ibGFua2RkAgIPZBYCZg8PFgYfAAUPVGlsbGfDpG5nbGlnaGV0HwEFUy9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9OTEwI29iaklkOTEwHwwFBl9ibGFua2RkAgMPZBYCAgEPDxYGHwEFUy9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9OTEwI29iaklkOTEwHwAFD1RpbGxnw6RuZ2xpZ2hldB8MBQZfYmxhbmtkZAIED2QWAmYPDxYGHwAFDE55cHJvZHVrdGlvbh8BBVUvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTExNjEjb2JqSWQxMTYxHwwFBl9ibGFua2RkAgUPZBYCAgEPDxYGHwEFVS9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9MTE2MSNvYmpJZDExNjEfAAUMTnlwcm9kdWt0aW9uHwwFBl9ibGFua2RkAgYPZBYCZg8PFgYfAAUTRWogYmVzaXR0bmluZ3Nyw6R0dB8BBVUvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTEyNDkjb2JqSWQxMjQ5HwwFBl9ibGFua2RkAgcPZBYCAgEPDxYGHwEFVS9DTS9UZW1wbGF0ZXMvZmFxLmFzcHg/Y21ndWlkPWY5OTgwMGEyLTQ2ZDQtNDI5My1hNzE0LThiNzU5ZjljYmMwOSZxaWQ9MTI0OSNvYmpJZDEyNDkfAAUcQmliZWjDpWxsZW4gcmVnaXN0cmVyaW5nc3RpZB8MBQZfYmxhbmtkZAIED2QWBGYPZBYCZg8PFgYfAAUHVW5nYWhlbR8BBVMvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTkwOSNvYmpJZDkwOR8MBQZfYmxhbmtkZAIBD2QWAgIBDw8WBh8BBVMvQ00vVGVtcGxhdGVzL2ZhcS5hc3B4P2NtZ3VpZD1mOTk4MDBhMi00NmQ0LTQyOTMtYTcxNC04Yjc1OWY5Y2JjMDkmcWlkPTkwOSNvYmpJZDkwOR8ABQdVbmdhaGVtHwwFBl9ibGFua2RkAg4PPCsACwIADxYOHwYCDx8FFgAeEEN1cnJlbnRQYWdlSW5kZXgCAh4JUGFnZUNvdW50AgkeFV8hRGF0YVNvdXJjZUl0ZW1Db3VudAJ9HhBWaXJ0dWFsSXRlbUNvdW50An0eCFBhZ2VTaXplAg9kARQrAAlkPCsABAEAFgIeCkhlYWRlclRleHQFNUFkcmVzczxpbWcgc3JjPSIuLi8uLi9pbWcvZV9hcnJvd19kb3duLmdpZiIgYm9yZGVyPTA+PCsABAEAFgIfEgVAU3RhZHNkZWw8aW1nIHNyYz0iLi4vLi4vaW1nL2VfYXJyb3dfZG93bl9zZWxlY3RlZC5naWYiIGJvcmRlcj0wPjwrAAQBABYCHxIFMlJ1bTxpbWcgc3JjPSIuLi8uLi9pbWcvZV9hcnJvd19kb3duLmdpZiIgYm9yZGVyPTA+PCsABAEAFgIfEgU2U3RvcmxlazxpbWcgc3JjPSIuLi8uLi9pbWcvZV9hcnJvd19kb3duLmdpZiIgYm9yZGVyPTA+PCsABAEAFgIfEgUzSHlyYTxpbWcgc3JjPSIuLi8uLi9pbWcvZV9hcnJvd19kb3duLmdpZiIgYm9yZGVyPTA+PCsABAEAFgIfEgU3QW50LmFubS48aW1nIHNyYz0iLi4vLi4vaW1nL2VfYXJyb3dfZG93bi5naWYiIGJvcmRlcj0wPmRkFgJmD2QWHgICD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD00YmMwZmY4Zi1hNGY0LTRmMjYtODU1MS1kYzUxNDc2OGYwOGRkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9NGJjMGZmOGYtYTRmNC00ZjI2LTg1NTEtZGM1MTQ3NjhmMDhkZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjZkZAIFDw8WAh8ABQQ5NzgyZGQCBg9kFgICAQ9kFgJmDxUBAzE4M2QCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD00YmMwZmY4Zi1hNGY0LTRmMjYtODU1MS1kYzUxNDc2OGYwOGQmYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTRiYzBmZjhmLWE0ZjQtNGYyNi04NTUxLWRjNTE0NzY4ZjA4ZCZhY3Rpb249cmVnaXN0ZXJkZAIDD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD05YzlkMTMyYS1kNGMzLTRmYWMtYTNlOS1mNTNjODcxMWE3MGJkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9OWM5ZDEzMmEtZDRjMy00ZmFjLWEzZTktZjUzYzg3MTFhNzBiZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjVkZAIFDw8WAh8ABQQ5Njk2ZGQCBg9kFgICAQ9kFgJmDxUBAzE4NWQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD05YzlkMTMyYS1kNGMzLTRmYWMtYTNlOS1mNTNjODcxMWE3MGImYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTljOWQxMzJhLWQ0YzMtNGZhYy1hM2U5LWY1M2M4NzExYTcwYiZhY3Rpb249cmVnaXN0ZXJkZAIED2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD02OTNkNjE5ZC0wNDRjLTRiMzMtYWJmNi0xNGU5ZGYzZTkwZGJkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9NjkzZDYxOWQtMDQ0Yy00YjMzLWFiZjYtMTRlOWRmM2U5MGRiZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjVkZAIFDw8WAh8ABQQ5Njk2ZGQCBg9kFgICAQ9kFgJmDxUBAzE5MmQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD02OTNkNjE5ZC0wNDRjLTRiMzMtYWJmNi0xNGU5ZGYzZTkwZGImYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTY5M2Q2MTlkLTA0NGMtNGIzMy1hYmY2LTE0ZTlkZjNlOTBkYiZhY3Rpb249cmVnaXN0ZXJkZAIFD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hZjc0Yzg4OC1jZjg1LTRlMzMtOTUyYS0zMDZjNjEwMWU0ZTNkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9YWY3NGM4ODgtY2Y4NS00ZTMzLTk1MmEtMzA2YzYxMDFlNGUzZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjZkZAIFDw8WAh8ABQQ5ODYxZGQCBg9kFgICAQ9kFgJmDxUBAzE4NWQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hZjc0Yzg4OC1jZjg1LTRlMzMtOTUyYS0zMDZjNjEwMWU0ZTMmYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWFmNzRjODg4LWNmODUtNGUzMy05NTJhLTMwNmM2MTAxZTRlMyZhY3Rpb249cmVnaXN0ZXJkZAIGD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hNmIyZjEzZS1hOWI4LTRjMTgtODUyYS0wMjU4ZWM4MjAxMjlkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9YTZiMmYxM2UtYTliOC00YzE4LTg1MmEtMDI1OGVjODIwMTI5ZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjZkZAIFDw8WAh8ABQQ5ODYxZGQCBg9kFgICAQ9kFgJmDxUBAzE4NGQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hNmIyZjEzZS1hOWI4LTRjMTgtODUyYS0wMjU4ZWM4MjAxMjkmYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWE2YjJmMTNlLWE5YjgtNGMxOC04NTJhLTAyNThlYzgyMDEyOSZhY3Rpb249cmVnaXN0ZXJkZAIHD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD0xMWZmNTc2OS1mNTI0LTQ4NzMtODJiYy1mOTU5Y2M2NmRlMjFkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9MTFmZjU3NjktZjUyNC00ODczLTgyYmMtZjk1OWNjNjZkZTIxZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjVkZAIFDw8WAh8ABQQ5Nzc1ZGQCBg9kFgICAQ9kFgJmDxUBAzE5MGQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD0xMWZmNTc2OS1mNTI0LTQ4NzMtODJiYy1mOTU5Y2M2NmRlMjEmYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTExZmY1NzY5LWY1MjQtNDg3My04MmJjLWY5NTljYzY2ZGUyMSZhY3Rpb249cmVnaXN0ZXJkZAIID2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hMjliMjZhNS0wYTc2LTRmMzEtOTAwOC0wOTQyOGVmZWIwY2ZkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9YTI5YjI2YTUtMGE3Ni00ZjMxLTkwMDgtMDk0MjhlZmViMGNmZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjVkZAIFDw8WAh8ABQQ5ODU0ZGQCBg9kFgICAQ9kFgJmDxUBAzE4MmQCBw9kFgQCAQ8PFgYfAQVhaHR0cDovL2thcnRvci5lbmlyby5zZS9xdWVyeT93aGF0PW1hcHMmZ2VvX2FyZWE9TGlsbGErVHVubmxhbmRzZ2F0YW4rKzMrJm1hcF9zaXplPTEmcGFydG5lcj12aXRlYx8AZR8KZ2RkAg8PDxYEHwIFDE55cHJvZHVrdGlvbh8KZ2RkAggPZBYEAgEPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1hMjliMjZhNS0wYTc2LTRmMzEtOTAwOC0wOTQyOGVmZWIwY2YmYWN0aW9uPXJlZ2lzdGVyZGQCAw8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWEyOWIyNmE1LTBhNzYtNGYzMS05MDA4LTA5NDI4ZWZlYjBjZiZhY3Rpb249cmVnaXN0ZXJkZAIJD2QWEmYPZBYEAgEPDxYEHwAFCERldGFsamVyHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD05NmNiMWUyOC0xMmUyLTQ5OGQtYmQ5ZS1mZGViZGY3ZjI0Y2RkZAIDDw8WAh8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9OTZjYjFlMjgtMTJlMi00OThkLWJkOWUtZmRlYmRmN2YyNGNkZGQCAQ8PFgIfAAUWTGlsbGEgVHVubmxhbmRzZ2F0YW4gM2RkAgIPDxYCHwAFB0jDtmdzYm9kZAIDDw8WAh8ABQEzZGQCBA8PFgIfAAUCNjZkZAIFDw8WAh8ABQUxMDAxOWRkAgYPZBYCAgEPZBYCZg8VAQMxMzJkAgcPZBYEAgEPDxYGHwEFYWh0dHA6Ly9rYXJ0b3IuZW5pcm8uc2UvcXVlcnk/d2hhdD1tYXBzJmdlb19hcmVhPUxpbGxhK1R1bm5sYW5kc2dhdGFuKyszKyZtYXBfc2l6ZT0xJnBhcnRuZXI9dml0ZWMfAGUfCmdkZAIPDw8WBB8CBQxOeXByb2R1a3Rpb24fCmdkZAIID2QWBAIBDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9OTZjYjFlMjgtMTJlMi00OThkLWJkOWUtZmRlYmRmN2YyNGNkJmFjdGlvbj1yZWdpc3RlcmRkAgMPDxYCHwEFU29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD05NmNiMWUyOC0xMmUyLTQ5OGQtYmQ5ZS1mZGViZGY3ZjI0Y2QmYWN0aW9uPXJlZ2lzdGVyZGQCCg9kFhJmD2QWBAIBDw8WBB8ABQhEZXRhbGplch8BBUNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9MDIzYWU5NTItMTA4Yi00YzZmLTg1MDMtZWE0M2YwOGUyNWJlZGQCAw8PFgIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTAyM2FlOTUyLTEwOGItNGM2Zi04NTAzLWVhNDNmMDhlMjViZWRkAgEPDxYCHwAFFkxpbGxhIFR1bm5sYW5kc2dhdGFuIDNkZAICDw8WAh8ABQdIw7Znc2JvZGQCAw8PFgIfAAUBM2RkAgQPDxYCHwAFAjY2ZGQCBQ8PFgIfAAUFMTAwMTlkZAIGD2QWAgIBD2QWAmYPFQEDMTMxZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTAyM2FlOTUyLTEwOGItNGM2Zi04NTAzLWVhNDNmMDhlMjViZSZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9MDIzYWU5NTItMTA4Yi00YzZmLTg1MDMtZWE0M2YwOGUyNWJlJmFjdGlvbj1yZWdpc3RlcmRkAgsPZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWY3ZGU4Y2EyLTZjZDctNDk0YS04YTcwLTU1MDM4Nzg2YzBlZmRkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1mN2RlOGNhMi02Y2Q3LTQ5NGEtOGE3MC01NTAzODc4NmMwZWZkZAIBDw8WAh8ABRZMaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATNkZAIEDw8WAh8ABQI2NWRkAgUPDxYCHwAFBDk5MzNkZAIGD2QWAgIBD2QWAmYPFQEDMTczZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWY3ZGU4Y2EyLTZjZDctNDk0YS04YTcwLTU1MDM4Nzg2YzBlZiZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9ZjdkZThjYTItNmNkNy00OTRhLThhNzAtNTUwMzg3ODZjMGVmJmFjdGlvbj1yZWdpc3RlcmRkAgwPZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWM4NzNmYzExLTlkN2QtNGQxMi1hZmM1LTc0NTEwMzE2NmMwMmRkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1jODczZmMxMS05ZDdkLTRkMTItYWZjNS03NDUxMDMxNjZjMDJkZAIBDw8WAh8ABRZMaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATJkZAIEDw8WAh8ABQI1NGRkAgUPDxYCHwAFBDgxNzdkZAIGD2QWAgIBD2QWAmYPFQEDMjU5ZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWM4NzNmYzExLTlkN2QtNGQxMi1hZmM1LTc0NTEwMzE2NmMwMiZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9Yzg3M2ZjMTEtOWQ3ZC00ZDEyLWFmYzUtNzQ1MTAzMTY2YzAyJmFjdGlvbj1yZWdpc3RlcmRkAg0PZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTk2N2ZkYjkxLTQ5YTEtNGFkZC04YzFiLTYzZDQ2NGI2NzdiY2RkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD05NjdmZGI5MS00OWExLTRhZGQtOGMxYi02M2Q0NjRiNjc3YmNkZAIBDw8WAh8ABRZMaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATJkZAIEDw8WAh8ABQI1NGRkAgUPDxYCHwAFBDgxNzdkZAIGD2QWAgIBD2QWAmYPFQEDMjM0ZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTk2N2ZkYjkxLTQ5YTEtNGFkZC04YzFiLTYzZDQ2NGI2NzdiYyZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9OTY3ZmRiOTEtNDlhMS00YWRkLThjMWItNjNkNDY0YjY3N2JjJmFjdGlvbj1yZWdpc3RlcmRkAg4PZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTUzYWVjNzJjLWVkMzUtNDQxMi05M2QwLWI2ZDc3MWFkNzVkZGRkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD01M2FlYzcyYy1lZDM1LTQ0MTItOTNkMC1iNmQ3NzFhZDc1ZGRkZAIBDw8WAh8ABRZMaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATJkZAIEDw8WAh8ABQI1NGRkAgUPDxYCHwAFBDgxNzdkZAIGD2QWAgIBD2QWAmYPFQEDMjI1ZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTUzYWVjNzJjLWVkMzUtNDQxMi05M2QwLWI2ZDc3MWFkNzVkZCZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9NTNhZWM3MmMtZWQzNS00NDEyLTkzZDAtYjZkNzcxYWQ3NWRkJmFjdGlvbj1yZWdpc3RlcmRkAg8PZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWIyODllMzgzLTY3NGItNGJlZi1hNTUyLTBhMGQyY2JjNzcxZmRkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD1iMjg5ZTM4My02NzRiLTRiZWYtYTU1Mi0wYTBkMmNiYzc3MWZkZAIBDw8WAh8ABRZsaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATJkZAIEDw8WAh8ABQI1NGRkAgUPDxYCHwAFBDgyNTZkZAIGD2QWAgIBD2QWAmYPFQEDMjA1ZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1saWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPWIyODllMzgzLTY3NGItNGJlZi1hNTUyLTBhMGQyY2JjNzcxZiZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9YjI4OWUzODMtNjc0Yi00YmVmLWE1NTItMGEwZDJjYmM3NzFmJmFjdGlvbj1yZWdpc3RlcmRkAhAPZBYSZg9kFgQCAQ8PFgQfAAUIRGV0YWxqZXIfAQVDb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTZkY2QwNTkzLTQxMWMtNDU0NS05ZDFkLWM2ZDkyOGM2ZDJlMWRkAgMPDxYCHwEFQ29iamVjdF9kZXRhaWxzLmFzcHg/b2JqZWN0Z3VpZD02ZGNkMDU5My00MTFjLTQ1NDUtOWQxZC1jNmQ5MjhjNmQyZTFkZAIBDw8WAh8ABRZMaWxsYSBUdW5ubGFuZHNnYXRhbiAzZGQCAg8PFgIfAAUHSMO2Z3Nib2RkAgMPDxYCHwAFATJkZAIEDw8WAh8ABQI1NGRkAgUPDxYCHwAFBDgyNTZkZAIGD2QWAgIBD2QWAmYPFQEDMTk4ZAIHD2QWBAIBDw8WBh8BBWFodHRwOi8va2FydG9yLmVuaXJvLnNlL3F1ZXJ5P3doYXQ9bWFwcyZnZW9fYXJlYT1MaWxsYStUdW5ubGFuZHNnYXRhbisrMysmbWFwX3NpemU9MSZwYXJ0bmVyPXZpdGVjHwBlHwpnZGQCDw8PFgQfAgUMTnlwcm9kdWt0aW9uHwpnZGQCCA9kFgQCAQ8PFgIfAQVTb2JqZWN0X2RldGFpbHMuYXNweD9vYmplY3RndWlkPTZkY2QwNTkzLTQxMWMtNDU0NS05ZDFkLWM2ZDkyOGM2ZDJlMSZhY3Rpb249cmVnaXN0ZXJkZAIDDw8WAh8BBVNvYmplY3RfZGV0YWlscy5hc3B4P29iamVjdGd1aWQ9NmRjZDA1OTMtNDExYy00NTQ1LTlkMWQtYzZkOTI4YzZkMmUxJmFjdGlvbj1yZWdpc3RlcmRkAg8PZBYgAgMPDxYEHwIFC0Zyc3RhIHNpZGFuHwpnZGQCBQ8PFgQfAgURRsO2cmVnw6VlbmRlIHNpZGEfCmdkZAIHDw8WAh8CBQtOw6RzdGEgc2lkYWRkAgkPDxYCHwIFC1Npc3RhIHNpZGFuZGQCCw8PFgIfAAUJU2lkYTogMy85ZGQCDQ8PFgIfAAURQW50YWwgcG9zdGVyOiAxMjVkZAIPDw8WBh8ABQExHghDc3NDbGFzcwUJbmF2QnV0dG9uHgRfIVNCAgJkZAIRDw8WBh8ABQEyHxMFCW5hdkJ1dHRvbh8UAgJkZAITDw8WBh8ABQEzHxMFEXNlbGVjdGVkTmF2QnV0dG9uHxQCAmRkAhUPDxYGHwAFATQfEwUJbmF2QnV0dG9uHxQCAmRkAhcPDxYGHwAFATUfEwUJbmF2QnV0dG9uHxQCAmRkAhkPDxYGHwAFATYfEwUJbmF2QnV0dG9uHxQCAmRkAhsPDxYGHwAFATcfEwUJbmF2QnV0dG9uHxQCAmRkAh0PDxYGHwAFATgfEwUJbmF2QnV0dG9uHxQCAmRkAh8PDxYCHwpoZGQCIQ8PFgIfCmhkZAIRDw8WAh8ABR5JbmdhIG9iamVrdCDDpHIgdGlsbGfDpG5nbGlnYS5kZAISDw8WAh8ABQEzZGQCEw8PFgIfAAUKaGFyZV9uYW1lMmRkAhUPZBYCZg9kFgRmD2QWAmYPFgIeCmJhY2tncm91bmQFHi9pbWcvZV9kb3R0ZWRsaW5lX2hvcml6b250LmdpZhYCZg8WAh4Dc3JjBQ4vaW1nL2VfcHhsLmdpZmQCAQ9kFgJmD2QWCgIBD2QWAmYPPCsACQEADxYEHwUWAB8GAgNkFgZmD2QWAgIBDw8WAh8BBTkvRGVmYXVsdC5hc3B4P2NtZ3VpZD1iYzRhZTNmMy0yOWU0LTQxOTgtODA0Ni1iOTU2MzM4ZmFmOTFkFgJmDxUBA0hlbWQCAg9kFgICAQ8PFgIfAQU9L0hTUy9EZWZhdWx0LmFzcHg/Y21ndWlkPWRlZTliMTZkLTdiMzAtNDcwZC1hODBhLTUwODU3ZTRjMGM2MWQWAmYPFQEOU8O2ayBsw6RnZW5oZXRkAgQPZBYCAgEPDxYCHwFlZBYCZg8VAR88Yj5Mw6RnZW5oZXRlcjogYWxsYSBsZWRpZ2E8L2I+ZAIDDxYCHxYFFy9pbWcvZV9uYXZ0cmFpbF9zZXAuZ2lmZAIFDw8WAh8ABRAmbGFxdW87IFRpbGxiYWthZGQCBw8WAh8WBRcvaW1nL2VfbmF2dHJhaWxfc2VwLmdpZmQCCQ8PFgIfAAUIU2tyaXYgdXRkZAIXDxcAFgICAQ88KwAJAQAPFgQfBRYAHwYCAWQWAmYPZBYGAgEPDxYGHwkFPS9DTS9kaXNwbGF5X2FkLmFzcHg/Z3VpZD03OTZiZmFjNy01OWRjLTQ3NDktYTY2Yy1jMzI1MWUxYWZkNDcfAgUYaHR0cDovL3d3dy5ib3BsYXRzZ2JnLnNlHwEFdi9DTS94dF9iYW5uZXJfY2xpY2tlZC5hc3B4P3BhZ2U9NGU2ZTc4MWUtNTI1Ny00MDNlLWIwOWQtN2VmYzhlZGIwYWM4JnNlY3Rpb249MSZhZD03OTZiZmFjNy01OWRjLTQ3NDktYTY2Yy1jMzI1MWUxYWZkNDdkZAIDDw8WAh8KaGRkAgUPDxYCHwpoZBYCZg8VAQEwZAIYDxcAFgICAQ88KwAJAQAPFgQfBRYAHwYCAWQWAmYPZBYGAgEPDxYMHwkFPS9DTS9kaXNwbGF5X2FkLmFzcHg/Z3VpZD1lMWU3Y2ZkMy04NGMyLTRjZDUtOTZkMC0wNTdkZmYwNzY4OWMeBVdpZHRoGwAAAAAAIIdAAQAAAB4GSGVpZ2h0GwAAAAAAQGBAAQAAAB8CBSdHw6UgdGlsbCBmcmFtdGlkZW5zIGludGVybm9tZmx5dHRuaW5nYXIfAQV2L0NNL3h0X2Jhbm5lcl9jbGlja2VkLmFzcHg/cGFnZT00ZTZlNzgxZS01MjU3LTQwM2UtYjA5ZC03ZWZjOGVkYjBhYzgmc2VjdGlvbj0yJmFkPWUxZTdjZmQzLTg0YzItNGNkNS05NmQwLTA1N2RmZjA3Njg5Yx8UAoADZGQCAw8PFgIfCmhkZAIFDw8WAh8KaGQWAmYPFQEBMGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFg8FHWRnTGlzdDpfY3RsMzppbWdOZXdseVByb2R1Y2VkBR1kZ0xpc3Q6X2N0bDQ6aW1nTmV3bHlQcm9kdWNlZAUdZGdMaXN0Ol9jdGw1OmltZ05ld2x5UHJvZHVjZWQFHWRnTGlzdDpfY3RsNjppbWdOZXdseVByb2R1Y2VkBR1kZ0xpc3Q6X2N0bDc6aW1nTmV3bHlQcm9kdWNlZAUdZGdMaXN0Ol9jdGw4OmltZ05ld2x5UHJvZHVjZWQFHWRnTGlzdDpfY3RsOTppbWdOZXdseVByb2R1Y2VkBR5kZ0xpc3Q6X2N0bDEwOmltZ05ld2x5UHJvZHVjZWQFHmRnTGlzdDpfY3RsMTE6aW1nTmV3bHlQcm9kdWNlZAUeZGdMaXN0Ol9jdGwxMjppbWdOZXdseVByb2R1Y2VkBR5kZ0xpc3Q6X2N0bDEzOmltZ05ld2x5UHJvZHVjZWQFHmRnTGlzdDpfY3RsMTQ6aW1nTmV3bHlQcm9kdWNlZAUeZGdMaXN0Ol9jdGwxNTppbWdOZXdseVByb2R1Y2VkBR5kZ0xpc3Q6X2N0bDE2OmltZ05ld2x5UHJvZHVjZWQFHmRnTGlzdDpfY3RsMTc6aW1nTmV3bHlQcm9kdWNlZO2R6184w93Nbt0R6VXd2Sg5aQgw",
								'ucTop:txtSearch': null
								};
							data['ucNavigationBarSimple:btn'+i] = i;

							$.ajax({
								type: "POST",
								data: data,
								cache: true,
								url: "http://www.boplats.se/HSS/Object/object_list.aspx?cmguid=4e6e781e-5257-403e-b09d-7efc8edb0ac8&objectgroup=1",
								dataType: 'html',
								success: processPageData(i, page_number),
								error: function(xhr, textStatus, error){
									alert(xhr.statusText+", "+textStatus+", "+error)
									},
								});
							
							}
						}

				//Mark initial AJAX req as complete
					ongoing_requests[0][0] = false;

				//Check if page fetch is completed
					checkPageFetchCompletion();

				},
			error: function(xhr, textStatus, error){
				alert(xhr.statusText+", "+textStatus+", "+error)
				},
			});
	
	}

function extractObjects(html_data){

	//Set object counter
		z = objects.length > 0 ? objects.length : 0;
	
	//Find objects in page
		$(html_data).find("table[id=dgList] tr.tbl_cell_list_even, table[id=dgList] tr.tbl_cell_list_odd").each(function(){
		
			//Track object req
				ongoing_requests[1][z] = true;
			
			//Insert object
				objects[z] = new Array();

			//Find object columns
				var columns = $(this).find("td");

			//Put data in object array
				for (i = 0; i < columns.length; i++){
					if (i == 0){
						url = $(columns[i]).find("a").attr('href');
						objects[z]['url'] = url;
						objects[z]['id'] = url.split("?")[1].split("=")[1];
						}
					if (i == 1){
						objects[z]['address'] = $(columns[i]).text().trim();
						}
					if (i == 2){
						objects[z]['area2'] = $(columns[i]).text().trim();
						}
					if (i == 3){
						objects[z]['rooms'] = $(columns[i]).text().trim();
						}
					if (i == 4){
						objects[z]['cost'] = $(columns[i]).text().trim();
						}
					if (i == 5){
						objects[z]['interested'] = $(columns[i]).find('span').text().trim();
						}
					}

			//Fetch additional page data
				extractObjectDeep(objects[z]['id'], z);

			z++;
			});

	}

function extractObjectDeep(id, z){
	
	//Initiate AJAX call to fetch more object data
		$.ajax({
			type: "GET",
			cache: true,
			url: "http://www.boplats.se/HSS/Object/object_details.aspx?objectguid=" + id,
			dataType: 'html',
			success: processObjectDeep(id, z),
			error: function(xhr, textStatus, error){
				alert(xhr.statusText+", "+textStatus+", "+error)
				},
			});
	}

function processObjectDeep(id, z){
	return function (returnData){
		
		//If response is null, restart ajax request
			regexp = new RegExp("HTTP request failed");
			if (regexp.test(returnData) == true || returnData == null){
				extractObjectDeep(id, z);
				return;
				}

		//Put data in object array
			objects[z]['size'] = $(returnData).find("span[id=lblSize]").text().trim().split(" ");
			objects[z]['floor'] = $(returnData).find("span[id=lblFloor]").text().trim();
			objects[z]['move_in_date'] = $(returnData).find("span[id=lblMoveIn]").text().trim();
			objects[z]['available_date'] = $(returnData).find("span[id=lblDateAvailable]").text().trim();
			objects[z]['last_reg_date'] = $(returnData).find("span[id=lblLastRegDate]").text().trim();
			objects[z]['boplats_id'] = $(returnData).find("span[id=lblObjectId]").text().trim();
			objects[z]['area'] = $(returnData).find("span[id=lblArea]").text().trim();
			objects[z]['description'] = $(returnData).find("span[id=lblDescription]").text().trim();
			objects[z]['planning'] = $(returnData).find("span[id=lblPlanning]").text().trim();
			objects[z]['properties'] = $(returnData).find("table[id=dlProperties] b").map(function(){return $(this).html().trim()}).get().join(", ");
			objects[z]['images'] = $(returnData).find("table[id=dlMultimedia] img").map(function(){pattern = /ico_pdf\.gif$/; if (pattern.test($(this).attr("src")) == false){return "http://www.boplats.se"+$(this).attr("src").trim()}}).get();
			objects[z]['pdfs'] = $(returnData).find("table[id=dlMultimedia] a").map(function(){return $(this).attr("href").trim().replace(/\.{2}\/\.{2}/, "http://www.boplats.se")}).get();
			objects[z]['icons'] = $(returnData).find("tr[id=trIcons] a.apartment_detail_legend").map(function(){return {id: $(this).attr("id"), src: $("img", this).attr("src").trim().replace(/\.{2}\/\.{2}/, "http://www.boplats.se")};}).get();
		
		//Set object tracking to complete
			ongoing_requests[1][z] = false;

		//Check if there are ongoing objects
			checkOngoingObjectRequests();
		}
	}

function scrollToOpenCollapsible(current_collapsible){
	
	//Check if there are any expanded items waiting to be collapsed
		var current_index = $(current_collapsible).index();
		$(current_collapsible).parent().children().each(function(){
			if (current_index != $(this).index() && $(this).collapsible("option", "collapsed") == false){
				setTimeout(function(){scrollToOpenCollapsible(current_collapsible)}, 5);
				false;
				}
			});
	
	//Scroll
		$.mobile.silentScroll($(current_collapsible).offset().top);
	}

function filterObjects(object_array){
	
	var new_object_array = Array();
	
	for (i = 0; i < object_array.length; i++){
		(function(){
			
			//Filters

				//Area
					if ($.inArray(object_array[i]['area'], $("input[id^='area[']:checked").map(function(){return $(this).val()}).get()) == -1){
						return;
						}

				//Rooms
					if (parseInt(object_array[i]['rooms']) < $("#min_rooms").val() || parseInt(object_array[i]['rooms']) > $("#max_rooms").val()){
						return;
						}
				
				//Cost
					if (parseInt(object_array[i]['cost']) < $("#min_cost").val() || parseInt(object_array[i]['cost']) > $("#max_cost").val()){
						return;
						}

				//Size
					if (parseInt(object_array[i]['size'][0]) < $("#min_size").val() || parseInt(object_array[i]['size'][0]) > $("#max_size").val()){
						return;
						}

				//Floor
					if (parseInt(object_array[i]['floor']) < $("#min_floor").val() || parseInt(object_array[i]['floor']) > $("#max_floor").val()){
						return;
						}

				//Available
					if ($("#available").val() != null && $.datepicker.parseDate('yy-mm-dd', $("#available").val()) > $.datepicker.parseDate('yy-mm-dd', object_array[i]['move_in_date'])){
						return;
						}

				//Icons
					for (z = 0; z < object_array[i]['icons'].length; z++){
						if ($.inArray(object_array[i]['icons'][z].id, $("input[id^='icon[']:checked").map(function(){return $(this).val()}).get()) == -1){
							return;
							}
						}

			//Add to new array
				new_object_array.push(object_array[i]);
			})();
		}
	
	return new_object_array;
	}

function sortObjects(object_array){
	
	//Empty sorting order
		sorting_order = Array();

	//Build new sorting order
		$("#sort_list li").each(function(){
			sorting_order.push($(this).attr("value"));
			});

	return object_array.sort(customSort);
	}

function customSort(a, b, level){
	
	//If level is undefined, set to initial level
		if (typeof(level) === "undefined"){
			level =	0;
			}

	//Fetch sorting column
		sorting_column = sorting_order[level];

	//Comparison values
		var pattern = /^\d+$/;
		value_a = $.isArray(a[sorting_column]) == true ? pattern.test(a[sorting_column][0]) == true ? parseInt(a[sorting_column][0]) : a[sorting_column][0].toLowerCase() : pattern.test(a[sorting_column]) == true ? parseInt(a[sorting_column]) : a[sorting_column].toLowerCase();
		value_b = $.isArray(b[sorting_column]) == true ? pattern.test(b[sorting_column][0]) == true ? parseInt(b[sorting_column][0]) : b[sorting_column][0].toLowerCase() : pattern.test(b[sorting_column]) == true ? parseInt(b[sorting_column]) : b[sorting_column].toLowerCase();

	//Run nested sorting function if needed
		if (value_a == value_b && level < (sorting_order.length - 1)){
			return customSort(a, b, (level + 1));
			}

	return value_a > value_b ? 1 : -1;
	}

function showResults(){
	
	//Change page
		location.hash = "#resultsPage";
	
	//Create collapsibleset div
		collapsiblesetdiv = $("<div>");
		collapsiblesetdiv.attr("data-role", "collapsibleset");
		collapsiblesetdiv.attr("data-theme", "a");
		collapsiblesetdiv.attr("data-content-theme", "a");
		collapsiblesetdiv.attr("data-inset", false);

	//Filter & sort objects
		var temp_objects = new Array();
		temp_objects = filterObjects(objects);
		temp_objects = sortObjects(temp_objects);

	//Add objects to collabsibleset div
		for (i = 0; i < temp_objects.length; i++){
			addResultObject(temp_objects[i], collapsiblesetdiv);
			}

	//Append to results page
		$("#resultsPage div[role='main']").empty();
		$("#resultsPage div[role='main']").append(collapsiblesetdiv);
	
	//Activate collapsibleset widget
		collapsiblesetdiv.collapsibleset().trigger('create');
		collapsiblesetdiv.children(":first").trigger('expand');
	}

function addResultObject(object, collapsiblesetdiv){

	//Create collapsiblediv
		var collapsiblediv = $("<div>").appendTo(collapsiblesetdiv)
			.attr("data-role", "collapsible")
			.on("collapsibleexpand", function (event, ui){
				scrollToOpenCollapsible(this);
				});

	//Add header
		var header = $("<h3>").appendTo(collapsiblediv);
		header.html(object['address'] + " (" + object['area2'] + ", " + object['area'] + ")");
	
	//Add body (<p>)
		var p = $("<p>").appendTo(collapsiblediv);

	//Icons
		var icons_div = $("<div>");
		if (object['icons'].length > 0){
			for (z = 0; z < object['icons'].length; z++){
				var img = $("<img>")
					.attr("src", object['icons'][z].src)
					.css({
						"padding-left": "5px",
						"padding-right": "5px",
						})
					.appendTo(icons_div);
				}
			}

	//Grid of details
		grid = Array(
			Array("Hyra", object['cost'], "Rum", object['rooms']),
			Array("Tillträde", object['move_in_date'], "Våning", object['floor']),
			Array("Tillgänglig", object['available_date'], "Storlek", object['size'].join("&nbsp;")),
			Array("Anm. datum", object['last_reg_date'], "Anmäl.", object['interested']),
			Array("Boplats&nbsp;ID", object['boplats_id'], null, icons_div)
			);

		for (z = 0; z < grid.length; z++){
			var div = $("<div>").addClass("ui-grid-a")
				.append($("<div>")
					.addClass("ui-block-a bold")
					.css("width", "30%")
					.append(grid[z][0]))
				.append($("<div>")
					.addClass("ui-block-b")
					.css("width", "30%")
					.append(grid[z][1]))
				.append($("<div>")
					.addClass("ui-block-c bold")
					.css("width", "25%")
					.append(grid[z][2]))
				.append($("<div>")
					.addClass("ui-block-d")
					.css("width", "15%")
					.append(grid[z][3]));
			p.append(div);
			}

	//Description
		if (typeof(object['description']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Beskrivning");
			p.append(div).append(object['description'].replace(/(<([^>]+)>)/ig,""));
			}
	
	//Properties
		if (typeof(object['properties']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Bostaden har");
			p.append(div).append(object['properties'].replace(/(<([^>]+)>)/ig,""));
			}

	//Planning
		if (typeof(object['planning']) !== 'undefined'){
			var div = $("<div>")
				.addClass("bold")
				.html("Planlösning");
			p.append(div).append(object['planning'].replace(/(<([^>]+)>)/ig,""));
			}
	
	//Buttons
		var buttons_div = $("<fieldset data-role='controlgroup' data-type='horizontal'>").appendTo(p);

		//Location button
			location_btn = $("<a>")
				.appendTo(buttons_div)
				.addClass("ui-btn ui-shadow ui-corner-all ui-icon-location ui-btn-icon-notext")
				.html("Location")
				.click({address: object['address'], area: (object['area'] == "Kommuner nära Göteborg" ? object['area2'] : "Göteborg")}, function(event){

					$("#mapIframe").get(0).contentWindow.setAddressMarker(event.data.address+", "+event.data.area);
					
					$("#mapPopup").popup("open", {
						"positionTo": "window",
						"transition": "fade",
						"tolerance": "15,15,15,15",
						})
						.popup({
							afterclose: function() {
								$("#mapIframe").get(0).contentWindow.removeAddressMarker();
								},
							});
					});

		//Images button
			if (object['images'].length > 0){
				image_btn = $("<a>")
					.appendTo(buttons_div)
					.addClass("ui-btn ui-shadow ui-corner-all ui-icon-camera ui-btn-icon-notext")
					.html("Photos")
					.click({imgs: object['images']}, function(event){
						img = $("<img>")
							.attr("id", "image_object")
							.addClass("photo")
							.load(function(){
								$("#imagePopup").popup("open", {
									"positionTo": "window",
									"transition": "fade",
									})
									.popup({
										afterclose: function() {
											$("#image_object").remove();
											},
										});
								})
							.error(function(){
								$("#image_object").remove();
								alert("Kunde inte ladda bild, fel på bilden ("+this.src+")");
								console.log('image error:' + this.src);
								})
							.attr("src", event.data.imgs[0]);
						$("#imagePopup").append(img);
						});
				}

		//PDF button
			if (object['pdfs'].length > 0){
				pdf_btn = $("<a>")
					.appendTo(buttons_div)
					.addClass("ui-btn ui-shadow ui-corner-all ui-icon-grid ui-btn-icon-notext")
					.html("PDFs");
				pdf_btn.click({pdfs: object['pdfs']}, function(event){
					window.open(event.data.pdfs[0], "_blank", "location=no,EnableViewPortScale=yes");
					});
				}

	}

function checkOngoingObjectRequests(){
	//Return true if there are still ongoing requests
		for (x = 0; x < ongoing_requests[1].length; x++){
			if (ongoing_requests[1][x] == true){
				updateProgress();
				return true;
				}
			}

	//If there are no ongoing requests, complete status bar and change to search page
		updateProgress(100);
		location.hash = "#searchPage";
	}

function updateProgress(value){
	
	//If no value is defined, calculate approximate progress based on ongoing requests compared to total requests
		if (typeof(value) === "undefined"){
			var count = 0;
			for (y = 0; y < ongoing_requests[1].length; y++){
				if (ongoing_requests[1][y] == false){
					count++;
					}
				}
			value = (count / ongoing_requests[1].length) * 80 + 20;
			}

	//Update progress bar
		$("#progressbar").progressbar("value", Math.round(value));

	}