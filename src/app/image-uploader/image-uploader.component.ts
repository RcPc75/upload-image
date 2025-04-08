import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadedImages: string[] = [];
  selectedPreviewImage: string | null = null;

  constructor(private http: HttpClient) {
    this.getImages();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<{ filePath: string }>('http://localhost:3000/upload', formData)
      .subscribe(() => {
        this.getImages();
        this.previewUrl = null;
        this.selectedFile = null;
      });
  }

  getImages() {
    this.http.get<string[]>('http://localhost:3000/images')
      .subscribe(images => this.uploadedImages = images);
  }

  viewImage(imageUrl: string) {
    this.selectedPreviewImage = imageUrl;
  }

  deleteImage(imageUrl: string) {
    this.http.post('http://localhost:3000/delete', { image: imageUrl }) // Replace with your actual endpoint
      .subscribe(() => {
        this.uploadedImages = this.uploadedImages.filter(img => img !== imageUrl);
      });
  }
}
