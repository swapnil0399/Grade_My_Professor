chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.todo == "showPageAction") {
        chrome.pageAction.show(sender.tab.id);
        sendResponse();
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request == 'get') {
        let profName = request.body.professor_name;
        let courseName = request.body.course_name;
        let req_id = request.id;
        getRequest(profName, courseName, req_id, sendResponse);
        return true;
    }
});

function getRequest(profName, courseName, reqId, sendResponse) {
    let xhr = new XMLHttpRequest();
    let reqStr = 'http://54.90.28.200:3000/?prof=' + profName;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                sendResponse({
                    response: "data",
                    status: 200,
                    id: reqId,
                    prof: profName,
                    course: courseName,
                    body: JSON.parse(xhr.responseText)
                });
            } else {
                sendResponse({
                    response: "error",
                    id: reqId,
                    prof: profName,
                    status: xhr.status
                });
            }
        }
    };
    xhr.open('GET', reqStr);
    xhr.send(null);
}