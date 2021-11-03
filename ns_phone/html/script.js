var flyMode = false
var sounds = false
var lastCreatedChat = {}
var isInActiveCall = false
var activeChart
const availableColors = [
    'red',
    'green',
    'blue',
    'yellow',
    'pink',
    'lila'
]

var availableJobs = [
    // "police",
    // "ambulance",
    // "cardealer",
    // "mechanic"
]

$(function () {
    var sound = new Howl({
        src: ['audio/ringtone.ogg'],
        volume: 0.05,
        loop: true,
        autoplay: false
    });
    var receiver = new Howl({
        src: ['audio/call.ogg'],
        volume: 0.08,
        loop: true,
        autoplay: false
    })
    window.addEventListener('message', function (event) {
        if (event.data.action == 'openPhone') {
            $('.phoneWrapper').slideDown("slow", function () {
                $('.phoneWrapper').removeClass('d-none')
            })
            AddTranslations()
        } else if (event.data.action == 'currentTime') {
            $('.lockTime').html(event.data.time.time)
            $('.lockDate').html(event.data.time.date)
            $('.topLeftIcons').html(event.data.time.time)
        } else if (event.data.action == 'setSettings') {
            $('.username').html(event.data.data.name)
            $('#phoneSettings').html(event.data.data.phone)
            $('.phoneWrapper').css({
                "background": "url(" + event.data.data.background + ")",
                "background-size": "97% 99%",
                "background-repeat": "no-repeat",
                'border-radius': '43px',
            })
            $('.lockScreen').css({
                "background": "url(" + event.data.data.lockscreen + ")",
                "background-size": "100% 100%",
                "background-repeat": "no-repeat",
                "background-position": "left top",
                'border-radius': '26px',
            })

            if (event.data.data.sounds == 1) {
                $('#soundsSlider').prop('checked', true)
                sounds = true
            } else {
                $('#soundsSlider').prop('checked', false)
                sounds = false
            }
            if (event.data.data.flymode == 1) {
                flyMode = true
                $('#flyMode').removeClass('d-none')
                $('#flyModeSlider').prop('checked', true)
            } else {
                flyMode = false
                $('#flyMode').addClass('d-none')
                $('#flyModeSlider').prop('checked', false)
            }

            $('.battery-level').css({
                'height': "100%"
            })
            if (event.data.data.battery < 10) {
                $('.battery-level').addClass('alert')
            } else {
                $('.battery-level').removeClass('alert')
            }

        } else if (event.data.action == 'setNotifications') {
            const notifications = event.data.notifications
            const parent = $('#lockscreenNotifications')
            parent.html('')
            if (!flyMode) {
                for (let i = 0; i < notifications.length; i++) {
                    let app = notifications[i].app.toUpperCase()
                    parent.append(`
                        <li class="notification">
                            <div class="header">
                                <div class="title">${app}</div>
                                <div class="time">${new Date(notifications[i].timestamp).toLocaleString("de-DE")}</div>
                            </div>
                            <div class="description">${notifications[i].text}</div>
                        </li>`)
                }
            }
        } else if (event.data.action == 'sendNotification') {
            if (sounds) {
                var notification = new Howl({
                    src: ['./audio/sound.ogg'],
                    volume: 0.08,
                    loop: false,
                    autoplay: false
                })
                notification.play()
            }
            if (!flyMode) {
                var target = $('.shortNotificationWrapper')
                $('.shortNotificationTitle').html(event.data.title)
                $('.shortNotificationDescription').html(event.data.message)
                target.slideDown('slow', function() {
                    target.removeClass('d-none')
                })
                // anime({
                //     targets: ".shortNotificationWrapper",
                //     translateY: [-100, 0],
                //     duration: 1000,
                //     easing: 'easeOutElastic'
                // })

                setTimeout(function () {
                    target.slideUp("slow", function() {
                        target.addClass('d-none')
                    })
                }, 4000)
            }
        } else if (event.data.action == 'setContacts') {
            const contacts = event.data.contacts
            $('.contentContacts').html('')
            for (let i = 0; i < contacts.length; i++) {
                $('.contentContacts').append(`
                    <li class="contentContact" data-id="${contacts[i].id}" data-name="${contacts[i].name}" data-number="${contacts[i].number}" data-email="${contacts[i].email}" data-favourite="${contacts[i].favourite}" data-avatar="${contacts[i].avatar ?? ''}">
                            <div class="contactPicture ${contacts[i].avatar ?? 'cp_' + availableColors[Math.floor(Math.random() * 6)]}" style="background: url(${contacts[i].avatar ?? ''}); background-size: 100% 100%">
                                ${contacts[i].avatar === undefined ? '<p>' + contacts[i].name.charAt(0) + '</p>' : ''}
                            </div>
                            <p> ${contacts[i].name} ${contacts[i].favourite == 1 ? '<i class="fas fa-star" stlye="color: yellow;"></i>' : ''}</p>
                        </li>
                    `)
            }
        } else if (event.data.action == 'setMessageList') {
            $('.contentMessagesList').html('')
            const messages = event.data.messages
            for (let i = 0; i < messages.length; i++) {

                $('.contentMessagesList').append(`
                    <li class="contentMessage" id="${messages[i].id}" data-receiver="${messages[i].receiver}" data-name="${messages[i].name.length == 0 ? messages[i].receiver : messages[i].name[0].name}">
                        <div class="contentMessageAvatar">
                            ${messages[i].isSenderRead ? '' : '<div class="contentMessageUnread"></div>'}
                        </div>
                        <div class="contentMessageTitle">
                            ${messages[i].name.length == 0 ? messages[i].receiver : messages[i].name[0].name}
                            <div class="contentMessageTimestamp">
                                ${new Date(messages[i].time).toLocaleString("de-DE")}
                            </div>
                        </div>
                        <div class="contentMessageText">
                            ${messages[i].lastMessage.length < 1 ? '' : messages[i].lastMessage[0].message}
                        </div>
                    </li>
                `)
            }
        } else if (event.data.action == 'setSingleMessages') {
            $('.messageSingleList').html('')
            const messages = event.data.messages
            let foundReceiver = false
            $('#messageSingleContent').attr('data-id', event.data.id)
            $('#messageList').animate({ scrollTop: $('#messageList').prop("scrollHeight") }, 100)
            for (let i = 0; i < messages.length; i++) {
                $('.messageSingleList').append(`<li class="${event.data.user[0].phone_number == messages[i].receiver ? 'receive' : 'send'} singleMessage">${messages[i].message}</li>`)
            }
            for (let k = 0; k < messages.length; k++) {
                if (!foundReceiver) {
                    foundReceiver = true
                    $('#messageSingleContent').attr('data-receiver', messages[k].name)
                }
            }
        } else if (event.data.action == 'openExistingChat') {
            const id = event.data.id
            const receiver = event.data.receiver
            const name = event.data.name
            $('#messageSingleTitle').html(name)
            $('#messageSingleContent').fadeIn("slow", function () {
                $('#messageSingleContent').removeClass('d-none')

            })

            $.post('https://ns_phone/getSingleMessages', JSON.stringify({
                id: id,
                receiver: receiver,
                name: name
            }))
        } else if (event.data.action == 'createNewChat') {
            const id = event.data.id
            const receiver = event.data.receiver
            const name = event.data.name
            $('#messageSingleTitle').html(name)
            $('#messageSingleContent').removeClass('d-none')
            $('#messageSingleContent').attr('data-id', id)
            $('#messageSingleContent').attr('data-receiver', receiver)
            anime({
                targets: '#messageSingleContent',
                translateY: [1000, 0],
                duration: 800,
                easing: 'easeInExpo'
            })

            $.post('https://ns_phone/getSingleMessages', JSON.stringify({
                id: id,
                receiver: receiver,
                name: name
            }))
        } else if (event.data.action == 'chatCreated') {
            const id = event.data.id

            $('#messageSingleTitle').html(lastCreatedChat.receiver)
            $('#chatAddContent').addClass('d-none')
            $('#messageSingleContent').removeClass('d-none')
            $('#messageSingleContent').fadeIn("slow")

            $.post('https://ns_phone/getSingleMessages', JSON.stringify({
                id: id,
                receiver: lastCreatedChat.receiver,
                name: lastCreatedChat.receiver
            }))
        } else if (event.data.action == 'setNotes') {
            $('.contentNotesList').html('')
            const notes = event.data.notes

            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            for (let i = 0; i < notes.length; i++) {
                let title = notes[i].title.replace('<br />', '')
                let text = notes[i].text.replace('<br />', '')
                $('.contentNotesList').append(`
                <li class="contentNoteItem" data-text="${notes[i].text}" data-id="${notes[i].id}">
                                <div class="contentNoteTitle">${title.length > 20 ? title.substring(0, 19) + '...' : title}
                                    <div class="contentNoteTimestamp">${new Date(notes[i].time).toLocaleDateString('de-DE', options)}</div>
                                </div>
                                <div class="contentNoteText">${text.length > 40 ? text.substring(0, 39) + '...' : text}</div>
                            </li>`)
            }
        } else if (event.data.action == 'sendToReceiver') {
            if (!isInActiveCall) {
                if (sounds) {
                    receiver.play()
                }
                $('#callSenderContent').attr('data-caller', event.data.caller)
                $('#callSenderContent').attr('data-name', event.data.contact)
                $('.callSenderName').html(event.data.contact + '<div class="callSenderType" id="callSenderType">'+Config.Translations[Config.Locale]['incoming_call']+'</div>')
                $('#callSenderContent').fadeIn("slow", function () {
                    $('#callSenderContent').removeClass('d-none')
                })
            }
        } else if (event.data.action == 'rejectCall') {
            $('#callReceiverContent').fadeOut('fast', function () {
                $('#callReceiverContent').addClass('d-none')
            })
            $('#callsContent').fadeIn("slow", function () {
                $('#callsContent').removeClass('d-none')
            })
            sound.stop()
        } else if (event.data.action == 'establishCall') {
            $('#callReceiverContent').fadeOut('slow', function () {
                $('#callReceiverContent').addClass('d-none')
            })
            $('#activeCallContent').fadeIn('fast', function () {
                $('#activeCallContent').removeClass('d-none')
            })
            $('#activeCallContent').attr('data-id', event.data.target)
            $('.activeCallName').html(($('#callReceiverContent').attr('data-name') ?? $('.numericInput').text()) + '<div class="activeCallTime">00:00</div>')
            isInActiveCall = true
            startTimer()
            sound.stop()
        } else if (event.data.action == 'rejectedCallByCaller') {
            if (sounds) {
                receiver.stop()
            }
            $('#callSenderContent').fadeOut("slow", function () {
                $('#callSenderContent').addClass('d-none')
            })
        } else if (event.data.action == 'endCall') {
            $('#activeCallContent').fadeOut("slow", function () {
                $('#activeCallContent').addClass('d-none')
            })
            $('.icons, .bottomIcons').fadeIn('fast', function () {
                $('.icons, .bottomIcons').removeClass('d-none')
            })
            stopTimer()
            isInActiveCall = false
        } else if (event.data.action == 'setCallList') {
            $('.callsContentList').html('')
            const calls = event.data.calls
            const owner = event.data.source
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            for (let i = 0; i < calls.length; i++) {
                $('.callsContentList').append(`
                    <li class="callsContentItem">
                        <div class="callsContentIcon">
                            <i class="fas fa-phone-alt"></i>
                        </div>
                        <div class="callsContentCaller ${calls[i].accepted == false ? 'missed' : ''}">
                            ${calls[i].caller != owner ? calls[i].callerName ?? calls[i].caller : calls[i].receiverName ?? calls[i].receiver}
                            <div class="callsContentTimestamp">
                                ${new Date(calls[i].time).toLocaleDateString("de-DE", options)}
                            </div>
                            <p class="callsContentType">${calls[i].caller != owner ? Config.Translations[Config.Locale]['incoming_call'] : Config.Translations[Config.Locale]['outgoing_call']}</p>
                        </div>
                    </li>
                `)
            }
        } else if (event.data.action == 'contactDeleted') {
            $('#contentContactContent').fadeOut('fast', function () {
                $('#contentContactContent').addClass('d-none')
            })
            $('#contactsContent').fadeIn("slow", function () {
                $('#contactsContent').removeClass('d-none')
            })
        } else if (event.data.action == 'contactUpdated') {
            $('#contactEditContent').fadeOut('fast', function () {
                $('#contactEditContent').addClass('d-none')
            })
            $('#contactsContent').fadeIn("slow", function () {
                $('#contactsContent').removeClass('d-none')
            })
        } else if (event.data.action == 'sendHealthData') {
            const steps = event.data.steps
            const health = event.data.health
            $('#healthSteps').html(steps + ' <p>Schritte</p>')
            $('#healthPulse').html(health + ' <p>Puls</p>')
        } else if (event.data.action == 'setStatistics') {
            var stats = event.data.statistics
            var ctx = document.getElementById('myChart');
            $('#healthStepsTotal').html(event.data.total)
            activeChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [Config.Translations[Config.Locale]['step_statistics']['1weekago'], Config.Translations[Config.Locale]['step_statistics']['6daysago'], Config.Translations[Config.Locale]['step_statistics']['5daysago'], Config.Translations[Config.Locale]['step_statistics']['4daysago'], Config.Translations[Config.Locale]['step_statistics']['3daysago'], Config.Translations[Config.Locale]['step_statistics']['yesterday'], Config.Translations[Config.Locale]['step_statistics']['today']],
                    datasets: [{
                        label: Config.Translations[Config.Locale]['steps'],
                        data: stats,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.3,
                        borderWidth: 1
                    }]
                },
            });
        } else if (event.data.action == 'setWalletData') {
            let userCC = event.data.card
            let newUserCC = userCC.match(/.{1,4}/g)
            const userName = event.data.name
            const userMoney = JSON.parse(event.data.accounts)
            const bank = userMoney.bank
            $('.bankCardnumber').html(newUserCC.join(' ') + "<br>" + userName)
            $('.bankBalance').html(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank))
            $('#personalCard, .walletTransferAccountDataCard').html(newUserCC.join(' '))
            $('#personalHolder, .walletTransferAccountDataHolder').html(event.data.name)
            $('#personalAmount, .walletTransferAccountDataAmount').html(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank))
            if (event.data.jobName != false) {
                $('.walletAccountTotalAmount').html(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank + event.data.jobMoney))
                $('#societyBorder, #societyBorder2, #societyAccount').removeClass('d-none')
                let jobCC = event.data.job
                let newJobCC = jobCC.match(/.{1,4}/g)
                $('#societyCard').html(newJobCC.join(' '))
                $('#societyHolder').html(event.data.jobName)
                $('#societyAmount').html(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(event.data.jobMoney))
                $('#lastBorder').addClass('d-none')
            } else {
                $('#societyBorder, #societyBorder2, #societyAccount').addClass('d-none')
                $('.walletAccountTotalAmount').html(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(bank))
                $('#lastBorder').removeClass('d-none')
            }
        } else if (event.data.action == 'setJobApp') {
            const jobApp = $('#jobApp')
            if (event.data.hasAccess) {
                if (!jobApp.length) {
                    $('#icons2').append(`
                    <span class="icon" id="jobApp">
                        <div class="image">
                            <div class="homeIcon">
                                <em class="fas fa-briefcase"></em>
                            </div>
                        </div>
                        <div class="text">${Config.Translations[Config.Locale]['dispatches']}</div>
                    </span>`)
                }
            } else {
                if (jobApp.length) {
                    jobApp.remove()
                }
            }
        } else if(event.data.action == 'receiveDispatch') {
            $('.jobAppList').prepend(`
            <li class="jobAppItem" data-coord-y="${event.data.coords.y}" data-coord-x="${event.data.coords.x}" id="${Math.floor(Math.random() * 9999999)}">
                <div class="jobAppItemSender">${event.data.sender}</div>
                <div class="jobAppItemTime">${event.data.time}</div>
                <div class="jobAppItemText">${event.data.message}</div>
            </li>`)
        } else if(event.data.action == 'setAvailableJobs') {
            var jobs = event.data.jobs
            $('.emergencyList').html('')
            for (let i =0; i < jobs.length; i++) {
                availableJobs.push(jobs[i])
                $('.emergencyList').append(`<li class="emergencyItem" id="${jobs[i]}">${Config.Translations[Config.Locale]['job_labels'][jobs[i]] ?? 'Set your job label in the config!'}<i class="fas fa-chevron-right"></i></li>`)
            }
        } else if(event.data.action == 'startCallFromOther') {
			console.log('triggered')
			createCall(event.data.number, event.data.number)
		}
    })

    $('.lockscreenDelete').click(function() {
        $.post('https://ns_phone/deleteNotifications')
        $('.notification').slideUp("slow")

    })

    $(document).on('click', '.jobAppItem', function() {
        $('.jobAppBottomIcons').slideToggle("slow")
        $('.jobAppBottomIcons').attr('data-coord-y', $(this).attr('data-coord-y'))
        $('.jobAppBottomIcons').attr('data-coord-x', $(this).attr('data-coord-x'))
        $('.jobAppBottomIcons').attr('data-id', $(this).attr('id'))
    })

    $('#emergencySubmit').click(function () {
        if ($('.emergencyInput').val().length > 0) {
            $.post('https://ns_phone/sendDispatch', JSON.stringify({
                target: $('#sendEmergencyCall').attr('data-job'),
                message: $('.emergencyInput').val()
            }))
        }
    })

    $('#deleteDispatch').click(function() {
        const id = $('.jobAppBottomIcons').attr('data-id')
        $('#'+id).remove()
        $('.jobAppBottomIcons').slideToggle("slow")

        $.post('https://ns_phone/successfullyDeleted')
    })

    $('#setWaypoint').click(function() {
        const coordsY = $('.jobAppBottomIcons').attr('data-coord-y')
        const coordsX = $('.jobAppBottomIcons').attr('data-coord-x')

        $.post('https://ns_phone/setWaypoint', JSON.stringify({
            y: coordsY,
            x: coordsX
        }))
        $('.jobAppBottomIcons').slideToggle("slow")
    })

    $(document).on('click', '.emergencyItem', function () {
        const id = $(this).attr('id')
        $('.emergencyInput').val('')
        const target = $('#sendEmergencyCall')
        target.attr('data-job', id)
        target.slideToggle("slow")
        for (let i = 0; i < availableJobs.length; i++) {
            if (id == availableJobs[i]) {
                if ($(`#${availableJobs[i]}`).hasClass('active')) {
                    $(`#${availableJobs[i]}`).removeClass('active')
                } else {
                    $(`#${availableJobs[i]}`).addClass('active')
                }
            } else {
                $(`#${availableJobs[i]}`).removeClass('active')
            }
        }
        // $(this).toggleClass('active')
        checkEmergencyInput()
    })

    function checkEmergencyInput() {
        const button = $('#emergencySubmit')
        setInterval(function () {
            const target = $('.emergencyInput').val()
            if (target.length == 0 || target.length < 5) {
                button.addClass('btn-disabled-dark')
                button.removeClass('btn-custom')
                button.attr('disabled', true)
            } else {
                button.removeClass('btn-disabled-dark')
                button.addClass('btn-custom')
                button.attr('disabled', false)
            }
        }, 100)
    }

    $('#sk-transfer-button').click(function () {
        $('#walletTransferContent').fadeIn("slow", function () {
            $('#walletTransferContent').removeClass('d-none')
        })
        checkInputs()
    })

    function checkInputs() {
        const button = $('#sk-transfer-confirm')
        setInterval(function () {
            const card = $('#skTransferCard').val()
            const amount = $('#skTransferAmount').val()
            const reason = $('#skTransferReason').val()
            if (card.length == 0 || amount.length == 0 || reason.length == 0) {
                button.addClass('btn-disabled')
                button.removeClass('btn-sk')
                button.attr('disabled', true)
            } else {
                button.removeClass('btn-disabled')
                button.addClass('btn-sk')
                button.attr('disabled', false)
            }
        }, 1000)
    }

    $('.finanzStatus').click(function () {
        $('#walletOverviewContent').fadeIn("slow", function () {
            $('#walletOverviewContent').removeClass('d-none')
        })
    })

    $('#sk-transfer-confirm').click(function () {
        const receiver = $('#skTransferCard').val()
        const amount = $('#skTransferAmount').val()
        const reason = $('#skTransferReason').val()

        $.post('https://ns_phone/transfer', JSON.stringify({
            receiver: receiver,
            amount: amount,
            reason: reason
        }))
        $('#skTransferCard').val('')
        $('#skTransferAmount').val('')
        $('#skTransferReason').val('')
    })

    $('#stepsMenu').click(function () {
        $.post('https://ns_phone/getStatistics')
        // $('#healthContent').fadeOut("slow", function () {
        //     $('#healthContent').addClass('d-none')
        // })
        $('#healthStepsContent').fadeIn('slow', function () {
            $('#healthStepsContent').removeClass('d-none')
        })
    })

    $('.contactShowEdit').click(function () {
        var name = $('.contactShowName').text()
        var number = $('.contactShowPhoneNumber').text()
        var email = $('.contactShowEmailNumber').text()

        $('#contactEdit_name').val(name)
        $('#contactEdit_number').val(number)
        $('#contactEdit_email').val(email == 'Keine Angabe' ? '' : email)

        $('#contentContactContent').fadeOut("fast", function () {
            $('#contentContactContent').addClass('d-none')
        })
        $('#contactEditContent').fadeIn('slow', function () {
            $('#contactEditContent').removeClass('d-none')
        })
    })

    $('#contactEdit_confirm').click(function () {
        var name = $('#contactEdit_name').val()
        var number = $('#contactEdit_number').val()
        var email = $('#contactEdit_email').val()
        var id = $('#contentContactContent').attr('data-uid')

        if (name.length > 0 && number.length > 0) {
            $.post('https://ns_phone/updateContact', JSON.stringify({
                name: name,
                number: number,
                email: email,
                id: id
            }))
        }
    })

    $('#shareContact').click(function () {
        const name = $('.contactShowName').text()
        const number = $('.contactShowPhoneNumber').text()
        $.post('https://ns_phone/shareContact', JSON.stringify({
            name: name,
            number: number
        }))
    })

    $('#deleteContact').click(function () {
        const name = $('.contactShowName').text()
        const number = $('.contactShowPhoneNumber').text()
        $.post('https://ns_phone/deleteContact', JSON.stringify({
            number: number,
            name: name,
        }))
    })

    $('.createCall').click(function () {
        createCall($('.contactShowPhoneNumber').text(), $('.contactShowName').text())
    })

    $('.activeCallCancel').click(function () {
        const id = $('#activeCallContent').attr('data-id')

        $.post('https://ns_phone/endCall', JSON.stringify({
            id: id
        }))

        $('#activeCallContent').fadeOut("slow", function () {
            $('#activeCallContent').addClass('d-none')
        })
        // $('.icons, .bottomIcons').fadeIn('fast', function() {
        //     $('.icons, .bottomIcons').removeClass('d-none')
        // })
        isInActiveCall = false
        stopTimer()
    })

    const availableKeys = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
    ]
    const availableActions = [
        "call", "delete"
    ]

    var interval

    function startTimer() {
        var m = 0
        var s = 0
        interval = setInterval(function () {
            if (s < 10 && m < 10) {
                $('.activeCallTime').html('0' + m + ':0' + s)
            } else if (s >= 10 && m < 10) {
                $('.activeCallTime').html('0' + m + ':' + s)
            } else if (m >= 10 && s < 10) {
                $('.activeCallTime').html(m + ':0' + s)
            } else if (m >= 10 && s >= 10) {
                $('.activeCallTime').html(m + ':' + s)
            }
            if (s == 60) {
                s = 0
                m++
            } else {
                s++
            }
        }, 1000)
    }

    function stopTimer() {
        clearInterval(interval)
    }

    $('.callSenderAccept').click(function () {
        let caller = $('#callSenderContent').attr('data-caller')

        $('#callSenderContent').fadeOut("fast", function () {
            $('#callSenderContent').addClass('d-none')
        })
        $('.activeCallName').html($('#callSenderContent').attr('data-name') + '<div class="activeCallTime">00:00</div>')
        $('#activeCallContent').attr('data-id', caller)
        $('#activeCallContent').fadeIn('slow', function () {
            $('#activeCallContent').removeClass('d-none')
        })

        $.post('https://ns_phone/establishCall', JSON.stringify({
            caller: caller
        }))
        isInActiveCall = true
        startTimer()

        receiver.stop()
    })

    $('.callSenderCancel').click(function () {
        $('#callSenderContent').fadeOut("slow", function () {
            $('#callSenderContent').addClass('d-none')
        })
        let caller = $('#callSenderContent').attr('data-caller')
        $.post('https://ns_phone/rejectCall', JSON.stringify({
            caller: caller
        }))
        receiver.stop()
    })

    $('.numericKeypadItem').click(function () {
        let key = $(this).attr('data-key')
        let action = $(this).attr('data-action')
        let input = $('.numericInput')
        if ($('.numericInput').text().length < 11) {
            if (availableKeys.includes(key)) {
                if (input.text().length < 10) {
                    input.append(key)
                }
            } else if (availableActions.includes(action)) {
                if (action == 'delete') {
                    input.text($.trim(input.text()).slice(0, -1))
                } else if (action == 'call') {
                    createCall(input.text(), null)
                }
            }
        }
    })

    function createCall(input, name) {
        $.post('https://ns_phone/createCall', JSON.stringify({
            receiver: input
        }))

        $('.callReceiverName').html((name ?? input) + '<div class="callSenderType">'+Config.Translations[Config.Locale]['outgoing_call']+'</div>')

        $('#callReceiverContent').fadeIn('slow', function () {
            $('#callReceiverContent').removeClass('d-none')
        })

        $('#callReceiverContent').attr('data-number', input)
        $('#callReceiverContent').attr('data-name', name)
        if (sounds) {
            sound.play()
        }
    }

    $('.callReceiverCancel').click(function () {
        $('#callReceiverContent').fadeOut('slow', function () {
            $('#callReceiverContent').addClass('d-none')
        })

        $.post('https://ns_phone/rejectCallByCaller', JSON.stringify({
            receiver: $('#callReceiverContent').attr('data-number')
        }))

        sound.stop()
    })

    $('#deleteNote').click(function () {
        const id = $('#noteShowContent').attr('data-id')

        $.post('https://ns_phone/deleteNote', JSON.stringify({
            id: id
        }))
        $.post('https://ns_phone/getNotes')
        setTimeout(function () {
            $('#noteShowContent').fadeOut("slow", function () {
                $('#noteShowContent').addClass('d-none')
            })
            $('#notesContent').fadeIn("slow", function () {
                $('#notesContent').removeClass('d-none')
            })
        }, 500)
    })

    $('#updateNote').click(function () {
        const text = $('#noteTextAreaUpdate').val()
        const firstLine = $('#noteTextAreaUpdate').val().split('\n');
        const title = firstLine[0]
        const id = $('#noteShowContent').attr('data-id')

        if (text.length > 0) {
            $.post('https://ns_phone/updateNote', JSON.stringify({
                text: text.replace(/\n\r?/g, '<br />'),
                title: title,
                id: id
            }))
        }
    })

    $(document).on('click', '.contentNoteItem', function () {
        let text = $(this).attr('data-text')
        let id = $(this).attr('data-id')
        $('#notesContent').fadeOut('slow', function () {
            $('#notesContent').addClass('d-none')
        })
        $('#noteShowContent').fadeIn('slow', function () {
            $('#noteShowContent').removeClass('d-none')
        })
        $('.note-textarea').val(text)
        $('#noteShowContent').attr('data-id', id)
    })

    $('#chatAddSubmitMessage').click(function () {
        const receiver = $('#chatAddReceiver').val()
        const message = $('#chatAddMessageInput').val()

        lastCreatedChat.receiver = receiver
        lastCreatedChat.message = message
        if (receiver.length > 0 && message.length > 0) {
            $.post('https://ns_phone/createChat', JSON.stringify({
                receiver: receiver,
                message: message
            }))
        }
    })

    $('#saveNote').click(function () {
        const text = $('#noteTextAreaCreate').val()
        const firstLine = $('#noteTextAreaCreate').val().split('\n');
        const title = firstLine[0]

        if (text.length > 0) {
            $.post('https://ns_phone/createNote', JSON.stringify({
                text: text.replace(/\n\r?/g, '<br />'),
                title: title
            }))
            $('#notesCreateContent').fadeOut("slow")
            $('#notesCreateContent').addClass('d-none')
            $('#notesContent').fadeIn("slow")
            $('#notesContent').removeClass('d-none')
        }
    })

    $('.createMessage').click(function () {
        $.post('https://ns_phone/createMessage', JSON.stringify({
            id: $('#contentContactContent').attr('data-uid'),
            name: $('.contactShowName').html()
        }))
    })

    $('#submitMessage').click(function () {
        const id = $('#messageSingleContent').attr('data-id')
        const message = $('#messageInput').val()
        const receiver = $('#messageSingleContent').attr('data-receiver')

        if (message.length > 0) {
            $.post('https://ns_phone/addMessage', JSON.stringify({
                id: id,
                message: message,
                receiver: receiver
            }))
            $('#messageInput').val('')
            $('.messageSingleList').append(`<li class="send singleMessage">${message}</li>`)
            if (sounds) {
                var audio = new Audio('./audio/message_sent.ogg')
                audio.play()
            }
        }
    })

    $(document).on('click', '.contentMessage', function () {
        const id = $(this).attr('id')
        const receiver = $(this).attr('data-receiver')
        const name = $(this).attr('data-name')
        $('#messageSingleTitle').html(name)
        $.post('https://ns_phone/getSingleMessages', JSON.stringify({
            id: id,
            receiver: receiver,
            name: name
        }))
        // $('#messagesContent').fadeOut('slow')
        // $('#messagesContent').addClass('d-none')
        $('#messageSingleContent').fadeIn("slow", function () {
            $('#messageSingleContent').removeClass('d-none')
        })
    })

    const textStrings = [
        'phone',
        'messages',
        'notes',
        'instagram',
        'reminder',
        'health',
        'wallet',
        'maps',
        'weather',
        'calls',
        'mail',
        'contacts',
        'settings',
        'clock',
        'emergency'
    ]

    function AddTranslations() {
        for (let i = 0; i < textStrings.length; i++) {
            $(`#${textStrings[i]} > .text`).text(Config.Translations[Config.Locale]['apps'][textStrings[i]])
        }
    }

    const menus = [
        'phone',
        'messages',
        'notes',
        'instagram',
        'health',
        'wallet',
        'maps',
        'calls',
        'mail',
        'contacts',
        'settings',
        'contactAdd',
        'contentContact',
        'messageSingle',
        'chatAdd',
        'notesCreate',
        'noteShow',
        'contactEdit',
        'emergency',
        'healthSteps',
        'walletOverview',
        'walletTransfer',
        'emergencySingle',
        'jobApp'
    ]

    for (let i = 0; i < menus.length; i++) {
        $(document).on('click', `#${menus[i]}`, function () {
            menu(menus[i])
        })
    }

    function menu(menu) {
        for (let i = 0; i < menus.length; i++) {
            if (menu != menus[i]) {
                // $(`#${menus[i]}Content`).fadeOut("slow", function () {
                //     $(`#${menus[i]}Content`).addClass('d-none')
                // })
            } else {
                $('.icons, .bottomIcons').fadeOut('fast', function () {
                    $('.icons, .bottomIcons').addClass('d-none')
                    $('#' + menus[i] + 'Content').fadeIn("slow", function () {
                        $(`#${menus[i]}Content`).removeClass('d-none')
                        $('.icons, .bottomIcons').fadeIn('fast', function () {
                            $('.icons, .bottomIcons').removeClass('d-none')
                        })
                    })
                })
                $(`#${menus[i]}Content`).attr('style', '')
                $('.phoneWrapper').css('background')
                if (menu == 'settings') {
                    $.post('https://ns_phone/getSettings')
                }
                if (menu == 'messages') {
                    $.post('https://ns_phone/getMessageList')
                }
                if (menu == 'chatAdd') {
                    $('.messageSingleList').html('')
                }
                if (menu == 'notes') {
                    $.post('https://ns_phone/getNotes')
                }
                if (menu == "calls") {
                    // $.post('https://ns_phone/getCallList')
                }
                if (menu == 'health') {
                    $.post('https://ns_phone/getHealthData')
                }
                if (menu == 'wallet') {
                    $.post('https://ns_phone/getWalletData')
                }
            }
        }
    }

    $('#numericKeypad').click(function () {
        $('#callListContent').fadeOut("slow", function () {
            $('#callListContent').addClass('d-none')
        })
        $('#numericKeypadContent').fadeIn("slow", function () {
            $('#numericKeypadContent').removeClass('d-none')
            $('#numericKeypadContent').attr('style', '')
        })
        $('#numericKeypad').addClass('active')
        $('#callList').removeClass('active')

        $('#callsTitle').html('Ziffernblock')
    })

    $('#callList').click(function () {
        $('#numericKeypadContent').fadeOut("slow", function () {
            $('#numericKeypadContent').addClass('d-none')
        })
        $('#callListContent').fadeIn("slow", function () {
            $('#callListContent').removeClass('d-none')
        })
        $('#numericKeypad').removeClass('active')
        $('#callList').addClass('active')

        $('#callsTitle').html('Anrufliste')
    })

    $(document).on('click', '.contentContact', function () {
        let id = $(this).data('id')
        let name = $(this).data('name')
        let number = $(this).data('number')
        let email = $(this).data('email')
        let favourite = $(this).data('favourite')
        let avatar = $(this).data('avatar')
        $('.contactShowName').html(name)
        $('.contactShowImage').html('<p>' + name.charAt(0) + '</p>')
        $('.contactShowImage').addClass(`cp_${availableColors[Math.floor(Math.random() * 6)]}`)
        $('.contactShowImage').removeAttr('style')
        $('.contactShowPhoneNumber').html(number)
        $('.contactShowEmailNumber').html(email ? 'Keine Angabe' : '')
        $('#favourite').html(favourite == 1 ? Config.Translations[Config.Locale]['remove_as_favourite']: Config.Translations[Config.Locale]['add_as_favourite'])
        if (favourite) {
            $('#favourite').css('color', 'red')
        } else {
            $('#favourite').css('color', 'rgb(26, 129, 247)')
        }
        $('#contentContactContent').attr('data-uid', id)
        $('#contentContactContent').attr('data-favourite', favourite)
        $(`#contentContactContent`).removeAttr('style')
        $('#contentContactContent').fadeIn("slow", function () {
            $(`#contentContactContent`).removeClass('d-none')
        })

        $('.phoneWrapper').css('background')
    })

    $('#favourite').click(function () {
        const id = $('#contentContactContent').attr('data-uid')
        $.post('https://ns_phone/toggleFavourite', JSON.stringify({
            id: id
        }))
        $('#contentContactContent').attr('data-favourite') ? $('#contentContactContent').attr('data-favourite', false) : $('#contentContactContent').attr('data-favourite', true)
        
        if ($('#contentContactContent').attr('data-favourite')) {
            $('#favourite').html(Config.Translations[Config.Locale]['add_as_favourite'])
            $('#favourite').css('color', 'rgb(26, 129, 247)')
        } else {
            $('#favourite').html(Config.Translations[Config.Locale]['remove_as_favourite'])
            $('#favourite').css('color', 'red')
        }
    })


    $(document).on('click', '#settingsLockscreenChange', function () {
        openMessageNotification('changeLockscreen')
    })

    function openMessageNotification(type) {
        $('#messageNotificationSubmit').data('type', type)
        $('.messageNotificationTitle').html(Config.Translations[Config.Locale][type]['title'])
        $('.messageNotificationText').html(Config.Translations[Config.Locale][type]['message'])
        $('#messageNotificationInput').attr('placeholder', Config.Translations[Config.Locale][type]['placeholder'])
        $('.messageNotification').removeClass('d-none')
        $('.messageNotification').css({
            "z-index": "10"
        })

        animateMessageNotification()
    }

    $(document).on('click', '#settingsBackgroundChange', function () {
        openMessageNotification('changeBackground')
    })

    function animateMessageNotification() {
        anime({
            targets: '.messageNotification',
            translateY: [-500, 0],
            duration: 800,
            easing: 'easeInExpo'
        })
        setTimeout(function () {
            $('.messageNotification').css({
                "z-index": "0"
            })
        }, 700)
    }

    function animeMessageNotificationOut() {
        anime({
            targets: '.messageNotification',
            translateY: [0, -500],
            duration: 800,
            easing: 'easeInExpo'
        })
        setTimeout(function () {
            $('.messageNotification').addClass('d-none')
        }, 800)
    }

    $(document).on('click', '#messageNotificationCancel', function () {
        $('#messageNotificationSubmit').data('type', '')
        $('#messageNotificationInput').val('')
        $('.messageNotification').css({
            "z-index": "10"
        })
        animeMessageNotificationOut()
    })

    $(document).on('click', '#messageNotificationSubmit', function () {
        var input = $('#messageNotificationInput').val()
        var type = $(this).data('type')

        if (input.length > 0) {
            animeMessageNotificationOut()
            $.post('https://ns_phone/updateData', JSON.stringify({
                input: input,
                type: type,
            }))
        } else {
            const xMax = 12;
            anime({
                targets: '.messageNotification',
                easing: 'easeInOutSine',
                duration: 550,
                translateX: [{
                    value: xMax * -1,
                }, {
                    value: xMax,
                }, {
                    value: xMax / -2,
                }, {
                    value: xMax / 2,
                }, {
                    value: 0
                }],
            })
        }
    })

    $('#flyModeSlider').change(function () {
        const checked = $(this).prop('checked')

        if (checked) {
            $('#flyMode').removeClass('d-none')
        } else {
            $('#flyMode').addClass('d-none')
        }
        $.post('https://ns_phone/toggleFlyMode', JSON.stringify({
            flyMode: checked == false ? 0 : 1
        }))
    })

    $('#soundsSlider').change(function () {
        const checked = $(this).prop('checked')

        $.post('https://ns_phone/toggleSounds', JSON.stringify({
            sounds: checked == false ? 0 : 1
        }))
    })

    $(document).on('click', '#goBackHome', function () {
        for (let i = 0; i < menus.length; i++) {
            $(`#${menus[i]}Content`).fadeOut("slow", function () {
                $(`#${menus[i]}Content`).addClass('d-none')
            })
        }
    })

    $(document).on('click', '#goBackPrevious', function () {
        var currentMenu = $(this).data('current')
        if (currentMenu == 'healthSteps') {
            activeChart.destroy()
        }
        $(`#${currentMenu}Content`).fadeOut("slow", function () {
            $(`#${currentMenu}Content`).addClass('d-none')
        })
    })

    $(document).on('click', '#lockScreenBtn', function () {
        $('.lockScreen').fadeOut("slow")
        setTimeout(function () {
            $('.lockScreen').addClass('d-none')
            anime({
                targets: '.lockScreen',
                translateY: [-1000, 0],
                duration: 800,
                easing: 'easeInExpo'
            })
        }, 800)
    })

    $('#contactAdd_confirm').click(function () {
        const name = $('#contactAdd_name').val()
        const number = $('#contactAdd_number').val()
        const profile_picture = $('#contactAdd_profile_picture').val()
        const email = $('#contactAdd_email').val()

        if (name.length > 0 && name.length < 100 && number.length > 0) {
            $.post('https://ns_phone/saveContact', JSON.stringify({
                name: name,
                number: number,
                profile_picture: profile_picture,
                email: email
            }))
            name.val('')
            number.val('')
            profile_picture.val('')
            email.val('')
        }
    })


    document.onkeyup = function (data) {
        if (data.which == 27) {

            $.post('https://ns_phone/closePhone')
            $('.phoneWrapper').slideUp("slow", function () {
                $('.phoneWrapper').addClass('d-none')
                $('.lockScreen').removeClass('d-none')
                $('.lockScreen').fadeIn('fast')
                for (let i = 0; i < menus.length; i++) {
                    $(`#${menus[i]}Content`).fadeOut("slow", function () {
                        $(`#${menus[i]}Content`).addClass('d-none')
                    })
                }
            })
        }
    }
})