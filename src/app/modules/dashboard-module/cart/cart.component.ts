import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/shared/models/CartItem/cart-item';
import { OrderRequest } from 'src/app/shared/models/OrderRequest/order-request';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  requestParamModel = new Request();
  cartItemModel = new CartItem();
  cartItemList: CartItem[] = [];
  placeOrderForm!: FormGroup;
  orderRequestModel = new OrderRequest;
  productInfoModel = new Product();
  CardRID: any;
  

  constructor(private productService: ProductService, private formBuilder: FormBuilder, private tostr: ToastrService
            , private orderService: OrderService, private spinner: NgxSpinnerService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCartItemList();
    this.initPlaceOrderForm();
    this.placeOrderForm = this.fb.group({
      location: ['colombo', Validators.required],
      city: [''] ,
      firstContact: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(10),Validators.required]],
      secondContact: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      quantity: ['', [Validators.required,Validators.pattern('^[0-9]*$')]],
      paymentMethod: ['', Validators.required],
      name: [''],
      address: [''],
      district: [''],
      bankSlip: [''],
    });
  }

  onChangeBankSlip(event: any) {
    const file = (event.target as any).files[0]; 
    this.placeOrderForm.patchValue({"bankSlip": file});
  }

  placeOrderByCart() {
    this.getproductDeliveryinfo();

    const name = this.placeOrderForm.controls['name']?.value;
    const address = this.placeOrderForm.controls['address']?.value;
    const location = this.placeOrderForm.controls['location']?.value;
    let city: string;

    if (location === 'outOfColombo') {
        city = this.placeOrderForm.controls['city']?.value;
    } else {
        city = this.placeOrderForm.controls['location']?.value;
    }

    //console.log("sad", this.placeOrderForm.controls['name']?.value);

    const district = this.placeOrderForm.controls['district']?.value;
    const firstContact = this.placeOrderForm.controls['firstContact']?.value;
    const secondContact = this.placeOrderForm.controls['secondContact']?.value;
    const paymentMethod = this.placeOrderForm.controls['paymentMethod']?.value;
    const quantity = this.placeOrderForm.controls['quantity']?.value;
    const bankSlip = this.placeOrderForm.controls['bankSlip']?.value;
    const FinalTotal = this.cartItemModel.FinaltotalAmount;
    console.log("data list",name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal)
    if (!name) {
        this.tostr.error("Empty Field Found", "Name is required");
    } else if (!address) {
        this.tostr.error("Empty Field Found", "Address is required");
    } else if (!city) {
        this.tostr.error("Empty Field Found", "City is required");
    } else if (!district) {
        this.tostr.error("Empty Field Found", "District is required");
    } else if (!firstContact || firstContact.length !== 10 ) {
        this.tostr.error("Empty Field Found", "First Contact is required or Wrong Number");
    } else if (!secondContact || secondContact.length !== 10) {
        this.tostr.error("Empty Field Found", "Second Contact is required or Wrong Number");
    } else if (!paymentMethod) {
        this.tostr.error("Empty Field Found", "Payment Method is required");
    } else {
      console.log("bankSlip",bankSlip);
        if (bankSlip) {
         
            this.convertImageToBase64(bankSlip).then((base64String) => {
              
                 this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal, base64String);
            })
        } else {
         
            this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal);
        }
    }
}


  placeOrder(name: string, address: string, city: string, district: string, firstContact: string, secondContact: string, paymentMethod: string, quantity: string, FinalTotal: number, bankSlip = "") {
    this.orderRequestModel.token = sessionStorage.getItem("authToken");
    this.orderRequestModel.name = name;
    this.orderRequestModel.address = address;
    this.orderRequestModel.city = city;
    this.orderRequestModel.district = district;
    this.orderRequestModel.firstContact = firstContact;
    this.orderRequestModel.secondContact = secondContact;
    this.orderRequestModel.paymentMethod = paymentMethod;
    // this.orderRequestModel.pid = this.productId;
    this.orderRequestModel.quantity = quantity;
    this.orderRequestModel.FinalTotal = FinalTotal;

    if (bankSlip != "") {
      this.orderRequestModel.bankSlip = bankSlip;
    }

    this.spinner.show();
    this.orderService.placeOrderByCart(this.orderRequestModel).subscribe((resp: any) => {

      if (resp.code === 1) {
        this.tostr.success("Place New Order", "Order Place Successfully.");
        location.reload();
      } else {
        this.tostr.error("Place New Order", resp.message);
      }

      this.spinner.hide();
    })
  }

  convertImageToBase64(fileInput: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const file: File = fileInput;
      const reader: FileReader = new FileReader();

      reader.onloadend = () => {
        // The result attribute contains the base64 string
        const base64String: string = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the image file as a Data URL
      reader.readAsDataURL(file);
    });
  }

  initPlaceOrderForm() {
    this.placeOrderForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      firstContact: ['', Validators.required],
      secondContact: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      quantity: ['', Validators.required],
      bankSlip: ['', Validators.required]
    })
  }

  loadCartItemList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    this.productService.getCartItemList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        dataList.data[0].forEach((eachData: CartItem, index: any) => {
          // const dataObj: any = eachData;
          this.cartItemList.push(eachData);
          console.log(dataList.data[0])
        })

        // this.cartItemModel.totalAmount = dataList.data[0].totalAmount;
      }
    })

    
  }
  

  removeOrderByCart(cartID: string) {
    console.log('Clicked Remove Product for CartID:', cartID);
    
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.CardRID = cartID;
    
    this.orderService.RemoveCart(this.requestParamModel).subscribe((resp: any) => {

      if (resp.code === 1) {
        this.tostr.success("Place New Order", "Order Place Successfully.");
        location.reload();
      } else {
        this.tostr.error("Place New Order", resp.message);
      }

      this.spinner.hide();
    })

    
}
  getproductDeliveryinfo(){
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    this.productService.getProductDeliverInfoById(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
       console.log(dataList.data,"dataList");
        
        // this.delivert
       this.productInfoModel.in_colombo_charges = dataList.data[0].in_colombo_charges;
        this.productInfoModel.out_of_colombo_charges = dataList.data[0].out_of_colombo_charges;
      
      }
    })

    this.orderService.getCartTotal(this.requestParamModel).subscribe((resp: any) => {
      const dataList = JSON.parse(JSON.stringify(resp))

      if (resp.code === 1) {
        this.cartItemModel.totalAmount = dataList.data[0].totalAmount;
      }
    })



  }

  onLocationChange(event: any) {
    const selectedValue = event.target.value;
    
    
    const cityControl = this.placeOrderForm.get('city');
    
    if (cityControl) {
        if (selectedValue === 'outOfColombo') {
          console.log("Selected Value: ", selectedValue);
            cityControl.enable();
           

            const totalAmount = parseFloat(this.cartItemModel.totalAmount);
            const outOfColomboCharges = parseFloat(this.productInfoModel.out_of_colombo_charges);

            const fullTotal = totalAmount + outOfColomboCharges;
            this.cartItemModel.FinaltotalAmount = fullTotal;
            console.log("fisnl Value: ", fullTotal);
           
        } else {
            cityControl.disable();
            cityControl.setValue(''); 
            const totalAmount = parseFloat(this.cartItemModel.totalAmount);
            const outOfColomboCharges = parseFloat(this.productInfoModel.in_colombo_charges);

            const fullTotal = totalAmount + outOfColomboCharges;
            this.cartItemModel.FinaltotalAmount = fullTotal;
            console.log("in Value: ", fullTotal);
        }
    }
   
  }
  

  isOutOfColombo() {
     const locationControl = this.placeOrderForm.get('location');
    return locationControl?.value === 'outOfColombo';
  }

}
