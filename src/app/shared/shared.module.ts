import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MessagesModule } from "primeng/messages";
import { PasswordModule } from "primeng/password";
import { ToastModule } from "primeng/toast";
import { HttpLoaderFactory } from "../app.module";
import { DndDirective } from "./diretcive/dnd.directive";
import { NamePipe } from "./pipes/namepipe";
import { SearchPipe } from "./pipes/searchpipes";
import {CascadeSelectModule} from 'primeng/cascadeselect';

@NgModule({
  declarations: [
    SearchPipe,
    NamePipe,
    DndDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FileUploadModule,
    InputTextareaModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    CascadeSelectModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ],
  exports: [
    CommonModule,
    SearchPipe,
    NamePipe,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FileUploadModule,
    InputTextareaModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    CascadeSelectModule,
    TranslateModule,
  ],
  providers: []
})


export class SharedModule {}
