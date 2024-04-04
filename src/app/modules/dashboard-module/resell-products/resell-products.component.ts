import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/shared/models/CartItem/cart-item';
import { OrderRequest } from 'src/app/shared/models/OrderRequest/order-request';
import { Product } from 'src/app/shared/models/Product/product';
import { Request } from 'src/app/shared/models/Request/request';
import { ResellProduct } from 'src/app/shared/models/ResellProduct/resell-product';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ResellService } from 'src/app/shared/services/resell/resell.service';

@Component({
  selector: 'app-resell-products',
  templateUrl: './resell-products.component.html',
  styleUrls: ['./resell-products.component.css']
})
export class ResellProductsComponent implements OnInit {

  requestParamModel = new Request();
  placeOrderForm!: FormGroup;
  addProductQuantityForm!: FormGroup;
  orderRequestModel = new OrderRequest();
  resellProductList: ResellProduct[] = [];
  productId!: string;
  searchTerm: string = '';
  filteredProducts: ResellProduct[] = [];
  cartItemModel = new CartItem();
  cartItemList: CartItem[] = [];
  productInfoModel = new Product();
  cartItemsCount: string='';

  constructor(private resellService: ResellService, private formBuilder: FormBuilder, private orderService: OrderService
            , private router: Router, private tostr: ToastrService, private spinner: NgxSpinnerService
            , private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadResellProductList();
    this.initPlaceOrderForm();
    this.getcartcount();
    this.initAddProductQuantityForm();
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
    });
  }

  removeResellProduct(productId: string) {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.productId = productId;

    this.resellService.removeResell(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("Remove Product From List", "Remove Successfully.");
      } else {
        this.tostr.error("Remove Product From List", resp.message);
      }
    })
  }

  onSubmitAddQuantityForm() {
    const quantity = this.addProductQuantityForm.controls['quantity'].value;

    if (quantity == "") {
      this.tostr.error("Empty Field Found", "Quantity is required");
    } else {
      this.requestParamModel.token = sessionStorage.getItem("authToken");
      this.requestParamModel.productId = this.productId;
      this.requestParamModel.quantity = quantity;

      this.productService.addToCart(this.requestParamModel).subscribe((resp: any) => {
        if (resp.code === 1) {
          this.tostr.success("Add to Cart", "Product is Added cto Cart");
  
          location.reload();
        } else {
          this.tostr.error("Add to Cart", resp.message);
        }
      })
    }
  }

  initAddProductQuantityForm() {
    this.addProductQuantityForm = this.formBuilder.group({
      quantity: ['', Validators.required]
    })
  }

  onClickAddtoCart(productId: string) {
    this.productId = productId;
    // this.requestParamModel.token = sessionStorage.getItem("authToken");
    // this.requestParamModel.productId = productId;

    // this.productService.addToCart(this.requestParamModel).subscribe((resp: any) => {
    //   if (resp.code === 1) {
    //     this.tostr.success("Add to Cart", "Product is Added cto Cart");

    //     location.reload();
    //   } else {
    //     this.tostr.error("Add to Cart", resp.message);
    //   }
    // })
  }

  onClickCheckProduct(productId: string) {
    this.router.navigate(['/app/product', productId]);
  }

  setProductId(productId: string) {
    this.getproductDeliveryinfo(productId);
    this.productId = productId;
  }

  onChangeBankSlip(event: any) {
    const file = (event.target as any).files[0]; 
    this.placeOrderForm.patchValue({"bankSlip": file});
  }

  onSubmitPlaceOrder() {
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
    this.orderRequestModel.pid = this.productId;
    this.orderRequestModel.quantity = quantity;
    this.orderRequestModel.FinalTotal = FinalTotal;

    if (bankSlip != "") {
      this.orderRequestModel.bankSlip = bankSlip;
    }

    this.spinner.show();
    this.orderService.placeNewOrder(this.orderRequestModel).subscribe((resp: any) => {

      if (resp.code === 1) {
        this.tostr.success("Place New Order", "Order Place Successfully.");
        this.placeOrderForm.reset();
        window.location.reload();
      } else {
        this.tostr.error("Place New Order", resp.message);
      }

      this.spinner.hide();
    })
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

  loadResellProductList() {

    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.resellService.getResellProductList(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        dataList.data[0].forEach((eachProduct: ResellProduct, index: any) => {
          this.resellProductList.push(eachProduct);
          this.filteredProducts = [...this.resellProductList];
        })
      }
    })
  }

  getcartcount(){
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    
    this.resellService.getResellProductCartCount(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
       
        this.cartItemsCount =  resp.data[0]['cartItemsCount'];;
        console.log('conut', this.cartItemsCount);    
      }
    })
  }

  goToCart() {
    console.log('Navigating to cart...'); // Add this line for debugging
    this.router.navigate(['/app/cart']);
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

  onSearch() {
    this.filteredProducts = this.resellProductList.filter((product) =>
      product.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      String(product.price).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      String(product.createTime).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getproductDeliveryinfo(productId: string){
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.productId = productId;

    this.productService.getProductDeliverInfoByPId(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
       console.log(dataList.data,"dataList");
        
        // this.delivert
       this.productInfoModel.in_colombo_charges = dataList.data[0].in_colombo_charges;
        this.productInfoModel.out_of_colombo_charges = dataList.data[0].out_of_colombo_charges;
      
      }
    })

    
        const selectedProduct = this.filteredProducts.find(product => product.productId === productId);
        if (selectedProduct) {
          const resellPrice = selectedProduct.resellPrice;
          console.log("Resell Price for product with ID '11':", resellPrice);
          this.cartItemModel.totalAmount = resellPrice;
        } else {
          console.log("Product with ID '11' not found in the list.");
        }
     


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
