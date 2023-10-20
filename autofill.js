// ==UserScript==
// @name         caiyicloud-autofill
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       adinxu
// @match        https://caiyicloud.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// ==/UserScript==

let refresh_time = 300;
let wait_time = 5

$(document).ready(function(){
    setTimeout(click_and_wait,300);
    setTimeout(wait_and_go,300);
    setTimeout(refresh_and_enter,300);
    setTimeout(fill_info_and_submit,300);
});
function click_and_wait(){
    let ele_start_btn = "#__layout > div > div > div > div.reserve-msg > div.reserve-button > div:nth-child(1)";
    let start_btn = queryByCCS(ele_start_btn);
    if(start_btn){
        start_btn.click();
    }else{
        console.log("00 stage not process");
    }
}
function wait_and_go(){
    console.log("try to process 01 stage");
    check_wait_state(wait_time)
}
function refresh_and_enter() {
    //first stage
    let ele_enter_btn = "#__layout > div > div > div.confirm-btn.disable";
    let enter_btn = queryByCCS(ele_enter_btn);
    if(enter_btn){
        console.log("first stage process===================================================");
        let in_text = enter_btn.innerText;
        console.log("enter button is "+in_text);
        if(in_text != "所选日期将于30日12点00分开放预约" || in_text == "确定"){
            console.log("enter page");
            enter_btn.click()
        }else{
            console.log("reload");
            setTimeout(reload_wrapper, refresh_time);
        }
    }
    else{
        console.log("first stage not process");
    }
}

function fill_info_and_submit() {
    //second stage
    let ele_add_person_btn = "#__layout > div > div > div.person-box > div.person-msg > div > div.add-person"
    let add_person_btn = queryByCCS(ele_add_person_btn);

    if(add_person_btn && add_person_btn.innerText == "添加参观者"){
        console.log("second stage process===================================================");
        add_person_btn.click()
        setTimeout(fill_info_and_submit_real,300);
    }
    else{
        console.log("second stage not process");
    }
}

function fill_info_and_submit_real(){
    let ele_name = "#__layout > div > div > div.person-box > div.person-msg > div > div.viewer-form-box > div > div.view_form_container > div:nth-child(1) > input";
    let ele_num = "#__layout > div > div > div.person-box > div.person-msg > div > div.viewer-form-box > div > div.view_form_container > div:nth-child(3) > input";
    let ele_submit_btn = "#__layout > div > div > div.person-box > div.person-btn > div";
    let name = queryByCCS(ele_name);
    let num = queryByCCS(ele_num);
    let submit_btn = queryByCCS(ele_submit_btn);
    if(name && num && submit_btn){
        try_to_fill_input_use_event(name, "张三");
        try_to_fill_input_use_event(num, "370728195508183628");
        submit_btn.click();
    }
}
function reload_wrapper(){
    window.location.reload();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function check_wait_state(tval) {
    console.log("开始等待");

    await wait(tval*1000);

    console.log("等待结束");
    let ele_wait_btn = "#__layout > div > div > div > div > div.button > div"
    let wait_btn = queryByCCS(ele_wait_btn);
    if(wait_btn && wait_btn.innerText == "我已阅读并同意声明内容"){
        console.log(wait_btn.innerText)
        wait_btn.click()
    }else{
        console.log("error!!!!!!!!")
    }
}

function try_to_fill_input_use_event(input, str_to_fill){
    input.value = str_to_fill;
    let input_event = document.createEvent('HTMLEvents');
    input_event.initEvent("input", true, true);
    input_event.eventType = 'message';
    input.dispatchEvent(input_event);
}

function try_to_fill_input_use_focus(input, str_to_fill){
    input.focus();
    document.execCommand('inserttext',false,str_to_fill);
    input.blur(); //失去焦点
}

function queryByXPATH(xpath_str){
    return document.evaluate(xpath_str, document, null, XPathResult.ANY_TYPE, null).iterateNext();
}
function queryByCCS(ccs_str){
    return document.querySelector(ccs_str);
}