const badges = ['primary', 'success', 'danger', 'warning', 'info'];

$(document).ready(function() {
    $('.button-link').on('click', attachEvents);
    let dataFound = $('.section-list').length;
    if (dataFound) {
        attachEvents();
    }
});

attachEvents = function() {
    let intervalWait = setInterval(() => {

            let dataNotFound = $('.zeromatches').length
            let dataFound = $('.section-list').length

            if (dataFound) {
                $('div.section-list').find("tr").each(function() {
                    $(this).on("click", { element: this }, addLinkToActions);

                    $(this).find("td a").each(function() {
                        $(this).on('click', function() {
                            setTimeout(function() {
                                $(window).load(attachEvents);
                            }, 300);
                        })
                    });

                    $(this).find("td.actions div").each(function() {
                        $(this).on('click', function() {
                            let reference = $(this).closest("tr");
                            dataToBePassed = {
                                data: {
                                    element: reference
                                }
                            }
                            addLinkToActions(dataToBePassed);
                        });
                    });
                });
                clearInterval(intervalWait);
            } else if (dataNotFound) {
                clearInterval(intervalWait);
            }
        },
        1000);
}

addLinkToActions = function(reference) {

    let child_row = '#' + $(reference.data.element).attr('id') + 'child';
    let child_content = child_row + 'content';
    let data_id = $(reference.data.element).attr('data-id').replace(/\./g, '-');
    let condition = $(child_row).length > 0 ? true : false;

    if (condition) {
        let profName = $(reference.data.element).find('td:nth-child(4)').find('a').text();
        let courseName = $(reference.data.element).find('td:nth-child(2)').find('a').text();

        profName = profName.substring(0, profName.indexOf(' ')) + ' ' + profName.substring(profName.lastIndexOf(' ') + 1);

        chrome.runtime.sendMessage({
            request: "get",
            id: data_id,
            body: {
                professor_name: profName,
                course_name: courseName
            }
        }, function(response) {
            if (response.response == 'data') {
                console.log(response);
                let waitTime = setInterval(() => {
                    let visibility = $(child_content).find('.courseinfo__overviewtable').length;
                    if (visibility) {
                        $.get(chrome.runtime.getURL('/templates/template.html'), function(data) {
                            result = ejs.render(data, response);
                            element = $(child_content).find('tbody tr:nth-child(4)').eq(1);
                            $(result).insertAfter(element);
                        });
                        clearInterval(waitTime);
                    }
                }, 200);

            } else {
                let waitTime = setInterval(() => {
                    let visibility = $(child_content).find('.courseinfo__overviewtable').length;
                    if (visibility) {
                        $.get(chrome.runtime.getURL('/templates/error.html'), function(data) {
                            result = ejs.render(data, response);
                            element = $(child_content).find('tbody tr:nth-child(4)').eq(1);
                            $(result).insertAfter(element);
                        });
                        clearInterval(waitTime);
                    }
                }, 200);
            }
        });

    }
}