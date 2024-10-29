import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  categoryForm!:FormGroup

  constructor( private fb:FormBuilder ,private category:ProductService,    private toastr: ToastrService  ) { 
    this.categoryForm=this.fb.group({
      title:['',Validators.required]
    })
  }

  ngOnInit(): void {
 
  }


  onSubmit(){

  if(this.categoryForm.valid){
    this.category.addCategoryService(this.categoryForm.value).subscribe((res)=>{
      this.toastr.success("Category Added" );
      this.categoryForm.reset()
    })
  }

  }

}
