/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */ 
//API Drink
const gBASE_URL_DRINK = "http://42.115.221.44:8080/devcamp-pizza365/drinks";
//API Voucher
const gBASE_URL_VOUCHER = "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/";
// API Creat order
const gBASE_URL_ORDER = "http://42.115.221.44:8080/devcamp-pizza365/orders";
// biến lưu thông tim size combo
var gComboMenuSize = {
    size: "",
    duongKinh: "",
    suon: "",
    salad: "",
    drink: "",
    priceVND: ""
}
//biến lưu loại pizza
var gPizzaType = "";
// biến lưu thông tin người dùng
var gUserData = {
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    loiNhan: "",
    voucher: "",
    discount: ""
}
// Đặt biến global để lưu toàn bộ thông tin đơn đặt hàng
var gObjectDataPostRequest = {
    kichCo: "",
    duongKinh: "",
    suon: "",
    salad: "",
    idLoaiNuocUong: "",
    soLuongNuoc: "",
    loaiPizza: "",
    idVourcher: "",
    discount:"",
    thanhTien: "",
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    loiNhan: ""
  }
  
/*** REGION 2 - Vùng gán / thực thi sự kiện cho các elements */ 
$(document).ready(function() {
    $(".combo-menu").on("click", ".combo-button", function() {
        onBtnMenuSizeClick(this, gComboMenuSize)
    });
    $(".pizza-type").on("click", ".pizza-button", function() {
        onBtnPizzaTypeClick(this, gPizzaType)
    });
    $("#btn-send-data").click(function() {
        onBtnSendData()
    });
    $("#btn-send-order").click(function() {
        onBtnConfirmOrder();
    });
    $('#modal-orderid').on('hidden.bs.modal', function (e) {
        location.reload();
      })
    //đổi màu button khi được click
    changeColorButtonClick();
    //thêm data drink vào select
    loadDataDrink();
    
    
});
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
//hàm xử lý khi click button size S
function onBtnMenuSizeClick(parambutton, paramMenuSize) {
    "use strict";
    //thu thập data combo
    getDataMenuComboSize(parambutton, paramMenuSize);
    //chuyển đên menu pizza
    $('#pizza')[0].scrollIntoView({ behavior: 'smooth' });
}
//hàm xử lý khi click buttob chọn pizza
function onBtnPizzaTypeClick(parambutton, paramPizzaType) {
    "use strict";
    //thu thập data pizza type
    gPizzaType = getDataPizzaType(parambutton, paramPizzaType);
    //chuyển đến menu chọn nước
    $('#drink')[0].scrollIntoView({ behavior: 'smooth' });
}
//hàm xử lý khi click gửi data
function onBtnSendData() {
    "use strict";
    $("#form-user-order").submit(function(event) {
        return false;   
    });
    var vDrink = $("#select-drink").val();
    var vCheck = true;
        // yêu cầu chon menu combo trước khi gửi đơn
        if (gComboMenuSize.duongKinh === "") {
            swal("Bạn hãy chọn combo phù hợp!")
            vCheck =  false;
            $('#combo')[0].scrollIntoView({ behavior: 'smooth' });
            throw "exit";
        }
        //yêu cầu chọn pizza
        if (gPizzaType === "") {
            swal("Bạn hãy chọn loại pizza yêu thích!");
            vCheck =  false;
            $('#pizza')[0].scrollIntoView({ behavior: 'smooth' });
            throw "exit";
        }
        if (vDrink === "") {
            swal("Bạn hãy chọn đồ uống nữa nhé!");
            vCheck =  false;
            $('#drink')[0].scrollIntoView({ behavior: 'smooth' });
            throw "exit";
        }
        if (vCheck === true) {
            //check data Form
            validateData();
        }
}
// hàm xử lý xác nhận order
function onBtnConfirmOrder() {
    "use strict";
    //call API creat order
    callApiCreatNewOrder(gObjectDataPostRequest); 
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
//hàm gọi API tạo order mới
function callApiCreatNewOrder(paramObjDataResquest) {
    "use strict";
    $.ajax({
        url: gBASE_URL_ORDER,
        type: "POST",
        data: JSON.stringify(paramObjDataResquest),
        contentType: "application/json",
        success: function(response) {
            //xử lý response trả về
            handleShowOrderId(response);
        },
        error: function() {
            swal("Xin lỗi hệ thống quá tải, bạn vui lòng đặt lại nhé");
        }
    });
}
//hàm xử lý đơn order vừa tạo
function handleShowOrderId(paramResponseNewOrder) {
    "use strict";
    console.log(paramResponseNewOrder)
    var vOrderId = $("#inp-new-orderid");
    vOrderId.val(paramResponseNewOrder.orderId);

    $("#modal-orderid").modal("show");

    $('#form-user-order').trigger("reset");
}
//hàm lấy data drink từ server
function loadDataDrink() {
    "use strict";
    //call Api get data drink
    callApiDataDrink();
}
// hàm gọi API lấy data drink
function callApiDataDrink() {
    "use strict";
    $.ajax({
        url: gBASE_URL_DRINK,
        type: "GET",
        success: function(response) {
            //đổ data vào select
            addDataDrinkToSelect(response);
        }
    });
}
//hàm đổ data drink lấy được vào ô chọn select
function addDataDrinkToSelect(paramResponseDrink) {
    "use strict";
    var vSelect = $("#select-drink");
    $(paramResponseDrink).each(function(bI, paramDrink) {
        vSelect.append($("<option>", {text: paramDrink.tenNuocUong, value: paramDrink.maNuocUong}));
    });
}
//hàm thu thập data combo size s
function getDataMenuComboSize(parambutton, paramMenuSize) {
    "use strict";
    var vDivCardBody = $(parambutton).parents("div").siblings(".card-body");
    var vDivCardHeader = $(parambutton).parents("div").siblings(".card-header");
    var vListSize = vDivCardBody.children("ul");
    paramMenuSize.duongKinh = vListSize.find("li:nth(0)").find("b").text();
    paramMenuSize.suon = vListSize.find("li:nth(1)").find("b").text();
    paramMenuSize.salad = vListSize.find("li:nth(2)").find("b").text();
    paramMenuSize.drink = vListSize.find("li:nth(3)").find("b").text();
    paramMenuSize.priceVND = vListSize.find("li:nth(4)").find("h2").attr("id");
    paramMenuSize.size = vDivCardHeader.children("h4").text();

    console.log("Size: " + paramMenuSize.size);
    console.log("Đường kính: " + paramMenuSize.duongKinh);
    console.log("Sườn nướng: " + paramMenuSize.suon);
    console.log("Salad: " + paramMenuSize.salad);
    console.log("Nước ngọt: " + paramMenuSize.drink);
    console.log("Giá combo: " + paramMenuSize.priceVND);
} 
//hàm lấy thông tin pizza được chọn
function getDataPizzaType(parambutton, paramPizzaType) {
    "use strict";
    var vDivCardBody = $(parambutton).parents("div").siblings(".card-body");
    paramPizzaType = vDivCardBody.find("h4").text();

    console.log("Pizza selected: " + paramPizzaType);
    return paramPizzaType;
} 
//hàm xử lý validate
function validateData() {
    "use strict";
    $.validator.addMethod('requiredNotBlank', function(value, element) {
        return $.validator.methods.required.call(this, $.trim(value), element);
    }, $.validator.messages.required);

    $.validator.addMethod("phoneNumber", function(value, element) {
        return this.optional(element) || /(01|03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value);
    }, "Vui lòng nhập đúng số điện thoại");

    $("#form-user-order").validate({
        rules: {
            fullname: {
                required: true,
                requiredNotBlank: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                minlength: 9,
                maxlength: 10,
                phoneNumber: true
            },
            address: {
                required: true,
                minlength: 2,
                requiredNotBlank: true
            }
        },
        messages: {
            fullname: {
                required: "Vui lòng nhập họ tên",
                requiredNotBlank: "Vui lòng nhập họ tên"
            },
            email: {
                required: "Vui lòng nhập email",
                email: "Vui lòng nhập đúng định dạng email"
            },
            phone: {
                required: "Vui lòng nhập số điện thoại",
                minlength: "Vui lòng nhập đúng số điện thoại",
                maxlength: "Vui lòng nhập đúng số điện thoại"
            },
            address: {
                required: "Vui lòng nhập địa chỉ",
                minlength: "Địa chỉ phải từ 2 kí tự",
                requiredNotBlank: "Vui lòng nhập địa chỉ"
            },
        },
        submitHandler: function() {
            handleDataUser();
        }
    });
} 

function handleDataUser() {
    "use strict";
    //thu thập dữ liệu
    getDataUser(gUserData);
    //call API tạo Order
    if (gUserData.voucher !== "") {
        gUserData.discount = callApiCheckVoucher(gUserData.voucher);
    }
    else {
        gUserData.discount = 0;
    }
    if ($("#select-drink").val() !== "") {
        showDataOrderToModal(gUserData, gComboMenuSize, gPizzaType);
    }
    else {
        swal("Bạn hãy chọn nước uống nhé !");
        $('#drink')[0].scrollIntoView({ behavior: 'smooth' });
    }
}
//hàm thu thập data user
function getDataUser(paramUerData) {
    "use strict";
    paramUerData.hoTen = $("#inp-fullname").val().trim();
    paramUerData.email = $("#inp-email").val().trim();
    paramUerData.soDienThoai = $("#inp-phonenumber").val().trim();
    paramUerData.diaChi = $("#inp-address").val().trim();
    paramUerData.voucher = $("#inp-discount").val().trim();
    paramUerData.loiNhan = $("#inp-messages").val().trim();
    
    console.log("Tên: " + paramUerData.hoTen);
    console.log("Email: " + paramUerData.email);
    console.log("Số điện thoại: " + paramUerData.soDienThoai);
    console.log("Địa chỉ: " + paramUerData.diaChi);
    console.log("Lời nhắn: " + paramUerData.loiNhan);
    console.log("Voucher: " + paramUerData.voucher);
}
//hàm check mã voucher
function callApiCheckVoucher(paramVoucherId) {
    "use strict";
    $.ajax({
        url: gBASE_URL_VOUCHER + paramVoucherId,
        type: "GET",
        async : false,
        success: function(response) {
            //đổ data vào select
            handleVoucherDisCount(response);
        },
        error: function() {
            swal("Mã giảm giá không hợp lệ");
            gUserData.discount = 0;
        }
    });
    return gUserData.discount;
}

function handleVoucherDisCount(paramResponseVoucher) {
    "use strict";
    //console.log(paramResponse);
    gUserData.discount = parseInt(paramResponseVoucher.phanTramGiamGia, 10);
    swal("Bạn được giảm giá " + paramResponseVoucher.phanTramGiamGia + "%");
}

function showDataOrderToModal(paramUserData, paramMenuSize, paramPizzaType) {
    "use strict";
    var vDetailOrder = $("#detail-order");
    var vDrink = $("#select-drink").val();
    var vPriceDiscount = parseInt(paramMenuSize.priceVND, 10) - parseInt(paramMenuSize.priceVND, 10) * (paramUserData.discount) / 100
    //console.log(vPriceDiscount);
    vDetailOrder.html("");
    vDetailOrder.append("- Size combo: " + paramMenuSize.size + "<br>");
    vDetailOrder.append("- Loại pizza: " + paramPizzaType + "<br>");
    vDetailOrder.append("- Đường kính: " + paramMenuSize.duongKinh + "<br>");
    vDetailOrder.append("- Sườn nướng: " + paramMenuSize.suon + "<br>");
    vDetailOrder.append("- Sườn nướng: " + paramMenuSize.salad + "<br>");
    vDetailOrder.append("- Nước ngọt: " + vDrink + "<br>");
    vDetailOrder.append("- Số lượng nước: " + paramMenuSize.drink + "<br>");
    vDetailOrder.append("- Discount: " + paramUserData.discount + "%" + "<br>");
    vDetailOrder.append("- Thanh toán: " + vPriceDiscount + "vnđ");

    $("#modal-fullname").val(paramUserData.hoTen);
    $("#modal-email").val(paramUserData.email);
    $("#modal-phone").val(paramUserData.soDienThoai);
    $("#modal-address").val(paramUserData.diaChi);
    $("#modal-messages").val(paramUserData.loiNhan);
    $("#modal-voucher").val(paramUserData.voucher);
    // hiển thị modal
    $("#order-modal").modal("show");
    // luw thông tin order vào biến toàn cục
    gObjectDataPostRequest.hoTen = paramUserData.hoTen;
    gObjectDataPostRequest.email = paramUserData.email;
    gObjectDataPostRequest.soDienThoai = paramUserData.soDienThoai;
    gObjectDataPostRequest.diaChi = paramUserData.diaChi;
    gObjectDataPostRequest.loiNhan = paramUserData.loiNhan;
    gObjectDataPostRequest.kichCo = paramMenuSize.size;
    gObjectDataPostRequest.duongKinh = paramMenuSize.duongKinh;
    gObjectDataPostRequest.suon = paramMenuSize.suon;
    gObjectDataPostRequest.salad = paramMenuSize.salad;
    gObjectDataPostRequest.idLoaiNuocUong = vDrink;
    gObjectDataPostRequest.soLuongNuoc = paramMenuSize.drink;
    gObjectDataPostRequest.loaiPizza = paramPizzaType;
    gObjectDataPostRequest.idVourcher = paramUserData.voucher;
    gObjectDataPostRequest.discount = paramUserData.discount;
    gObjectDataPostRequest.thanhTien = vPriceDiscount;
}
//hàm đổi màu nút khi được click
function changeColorButtonClick() {
    "use strict";
    //size combo
    var vButtonSizeS = $("#btn-size-s");
    var vButtonSizeM = $("#btn-size-m");
    var vButtonSizeL = $("#btn-size-l");
    //pizza type
    var vButtonPizzaOcean = $("#btn-pizza-ocean");
    var vButtonPizzaHawaii = $("#btn-pizza-hawaii");
    var vButtonPizzaBacon = $("#btn-pizza-bacon");

    if (vButtonSizeS.click(function() {
        vButtonSizeS.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonSizeM.addClass("btn w3-orange w-100");
        vButtonSizeL.addClass("btn w3-orange w-100");
    }));
    if (vButtonSizeM.click(function() {
        vButtonSizeM.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonSizeL.addClass("btn w3-orange w-100");
        vButtonSizeS.addClass("btn w3-orange w-100");
    }));
    if (vButtonSizeL.click(function() {
        vButtonSizeL.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonSizeM.addClass("btn w3-orange w-100");
        vButtonSizeS.addClass("btn w3-orange w-100");
    }));
    
    if (vButtonPizzaOcean.click(function() {
        vButtonPizzaOcean.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonPizzaHawaii.addClass("btn w3-orange w-100");
        vButtonPizzaBacon.addClass("btn w3-orange w-100");
    }));
    if (vButtonPizzaHawaii.click(function() {
        vButtonPizzaHawaii.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonPizzaOcean.addClass("btn w3-orange w-100");
        vButtonPizzaBacon.addClass("btn w3-orange w-100");
    }));
    if (vButtonPizzaBacon.click(function() {
        vButtonPizzaBacon.addClass("btn w3-green w-100").removeClass("w3-orange");
        vButtonPizzaHawaii.addClass("btn w3-orange w-100");
        vButtonPizzaOcean.addClass("btn w3-orange w-100");
    }));
}   
