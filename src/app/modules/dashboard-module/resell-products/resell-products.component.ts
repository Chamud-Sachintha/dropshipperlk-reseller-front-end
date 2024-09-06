import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, firstValueFrom, map } from 'rxjs';
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
  cartItemsCount: string = '';
  Updateprice!: any;
  priceupdateform!: FormGroup;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 100;

  keyword = 'name';
  filterData: any[] = [];
  showDrpDown = false;

  allCities: { cityName: string, [key: string]: any }[] = [
    { cityName: 'New York', country: 'USA' },
    { cityName: 'Los Angeles', country: 'USA' },
    { cityName: 'Chicago', country: 'USA' },
    { cityName: 'Toronto', country: 'Canada' },
    // Add more cities as needed
  ];
  data: { cityName: string, [key: string]: any }[] = [];
  selectedCity: string = '';
  finalTotalAmount = 0;
  isDeliveryChargeApplied = false;

  constructor(private resellService: ResellService, private formBuilder: FormBuilder, private orderService: OrderService
    , private router: Router, private tostr: ToastrService, private spinner: NgxSpinnerService
    , private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // Fetch and store cities if not already done
    if (!localStorage.getItem('cities')) {
      this.loadCityList();
    } else {
      // Load cities from localStorage
      this.allCities = JSON.parse(localStorage.getItem('cities') || '[]')
        .map((city: any) => city);
    }

    this.loadResellProductList();
    this.initPlaceOrderForm();
    this.getcartcount();
    this.initAddProductQuantityForm();
    this.priceupdateform = this.fb.group({
      URprice: ['']
    });
    this.placeOrderForm = this.fb.group({
      location: ['', Validators.required],
      city: [''],
      firstContact: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.required]],
      secondContact: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      paymentMethod: ['', Validators.required],
      name: [''],
      address: [''],
      district: [''],
      bankSlip: [''],
      inColombo: ['', Validators.required],
      remark: ['', Validators.required]
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    this.showDrpDown = false;
  }

  onSearchV(event: any): void {
    this.showDrpDown = true;
    const query = event.target.value.toLowerCase().trim();
    if (query) {
      this.data = this.allCities.filter((city: any) =>
        city.toLowerCase().includes(query)
      );
    } else {
      this.data = [...this.allCities]; // Reset to all cities if query is empty
    }
  }

  onSelect(city: any): void {
    this.selectedCity = city;
    this.showDrpDown = false;

    this.placeOrderForm.controls['location'].setValue(this.selectedCity);
    // Additional logic can be added here if needed
  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onChangeSearch(query: string) {
    if (!query) {
      this.data = this.allCities; // Show all if query is empty
    } else {
      this.data = this.allCities
        .filter((city: any) => { console.log(city); city.toLowerCase().includes(query.toLowerCase()) });
    }
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something when input is focused
  }

  loadCityList() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    return firstValueFrom(this.resellService.getCityList(this.requestParamModel))
      .then((resp: any) => {
        const dataList = resp.data; // No need to parse if `resp.data` is already an object
        localStorage.setItem('cities', JSON.stringify(dataList[0].map((el: any) => el.cityName)));
      })
      .catch((error) => {
        console.error('Error fetching city list:', error);
        // Handle the error appropriately here
      });
  }

  onItemSelect(selectedItem: any) {
    console.log('Selected item:', selectedItem);
  }

  pageChanged(event: any): void {
    this.currentPage = event;
    // this.loadResellProductList();
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
    this.placeOrderForm.patchValue({ "bankSlip": file });
  }

  onSubmitPlaceOrder() {
    const name = this.placeOrderForm.controls['name']?.value;
    const address = this.placeOrderForm.controls['address']?.value;
    const location = this.placeOrderForm.controls['location']?.value;
    let city: any;

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
    const remark = this.placeOrderForm.controls['remark'].value;
    const FinalTotal = this.finalTotalAmount;

    const cityList = localStorage.getItem("cities");

    if (!this.verifyCity(city, cityList)) {
      this.tostr.error("Invalid City Selected", "City is required");
    }

    console.log("data list", name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal, bankSlip);
    if (!name) {
      this.tostr.error("Empty Field Found", "Name is required");
    } else if (!address) {
      this.tostr.error("Empty Field Found", "Address is required");
    } else if (!city) {
      this.tostr.error("Empty Field Found", "City is required");
    } else if (!district) {
      this.tostr.error("Empty Field Found", "District is required");
    } else if (!firstContact || firstContact.length !== 10) {
      this.tostr.error("Empty Field Found", "First Contact is required or Wrong Number");
    } else if (!secondContact || secondContact.length !== 10) {
      this.tostr.error("Empty Field Found", "Second Contact is required or Wrong Number");
    } else if (!paymentMethod) {
      this.tostr.error("Empty Field Found", "Payment Method is required");
    } else {
      if (bankSlip) {
        this.convertImageToBase64(bankSlip).then((base64String) => {
          console.log('slip part' + base64String)
          this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal, remark, base64String);
        })
      } else {
        this.placeOrder(name, address, city, district, firstContact, secondContact, paymentMethod, quantity, FinalTotal, remark);
      }

    }
  }

  verifyCity(city: any, cityList: any) {
    const f = JSON.parse(cityList);

    var res = false;
    f.forEach((el: any) => {
      if (el === city) {
        res = true;
      }
    })

    return res;
  }

  placeOrder(name: string, address: string, city: string, district: string, firstContact: string, secondContact: string, paymentMethod: string, quantity: string, FinalTotal: number, remark: string, bankSlip = "") {
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
    this.orderRequestModel.remark = remark;

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

  getcartcount() {
    this.requestParamModel.token = sessionStorage.getItem("authToken");

    this.resellService.getResellProductCartCount(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {

        this.cartItemsCount = resp.data[0]['cartItemsCount'];;
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

  getproductDeliveryinfo(productId: string) {
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.productId = productId;

    this.productService.getProductDeliverInfoByPId(this.requestParamModel).subscribe((resp: any) => {

      const dataList = JSON.parse(JSON.stringify(resp));

      if (resp.code === 1) {
        console.log(dataList.data, "dataList");

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

  onSetDeliveryCharge() {
    const paymentMethod = this.placeOrderForm.controls['paymentMethod'].value;
    if (paymentMethod === "3" && !this.isDeliveryChargeApplied) {
      // Apply the charge only if it hasn't been applied yet
      this.finalTotalAmount -= 350;
      this.isDeliveryChargeApplied = true;
    } else if (paymentMethod !== "3" && this.isDeliveryChargeApplied) {
      // Remove the charge only if it has been applied
      this.finalTotalAmount += 350;
      this.isDeliveryChargeApplied = false;
    }
  }

  onLocationChange(event: any) {
    const selectedValue = event.target.value;

    const location = this.placeOrderForm.controls['location']?.value;
    const inColomboCheck = this.placeOrderForm.controls['inColombo'].value;
    const cityControl = this.placeOrderForm.get('city');
    const Quantity = this.placeOrderForm.get('quantity');
    const QuantityValue = Quantity?.value;
    console.log("Selected location: ", location);
    if (cityControl) {
      if (inColomboCheck === '1') {
        console.log("Selected Value: ", selectedValue);
        cityControl.enable();


        const totalAmount = parseFloat(this.cartItemModel.totalAmount);
        const outOfColomboCharges = parseFloat(this.productInfoModel.out_of_colombo_charges);
        const totalqunity = parseFloat(QuantityValue);
        const fullTotal = (totalAmount * totalqunity) + outOfColomboCharges;

        this.finalTotalAmount = fullTotal;
        console.log("fisnl Value: ", fullTotal);

      } else {
        cityControl.disable();
        cityControl.setValue('');
        const totalAmount = parseFloat(this.cartItemModel.totalAmount);
        const totalqunity = parseFloat(QuantityValue);
        const outOfColomboCharges = parseFloat(this.productInfoModel.in_colombo_charges);

        const fullTotal = (totalAmount * totalqunity) + outOfColomboCharges;
        this.finalTotalAmount = fullTotal;
        console.log("in Value: ", fullTotal);
      }
    }

  }

  isOutOfColombo() {
    const locationControl = this.placeOrderForm.get('location');
    return locationControl?.value === 'outOfColombo';
  }

  onClickupdateProduct(productId: string) {
    this.Updateprice = productId;
    /*this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.productId = productId;

    this.resellService.updateResellPrice(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("Remove Product From List", "Remove Successfully.");
      } else {
        this.tostr.error("Remove Product From List", resp.message);
      }
    })*/
  }

  onClickupdateProductApi() {

    //console.log('data update>>>>>>',this.priceupdateform.controls['URprice'].value);
    this.requestParamModel.token = sessionStorage.getItem("authToken");
    this.requestParamModel.productId = this.Updateprice;
    this.requestParamModel.URprice = this.priceupdateform.controls['URprice'].value;

    this.resellService.updateResellPrice(this.requestParamModel).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.tostr.success("Product From List", "Update Successfully.");
        window.location.reload();
      } else {
        this.tostr.error("Product From List", resp.message);
      }
    })
  }


}
