import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../../core/services/university.service';
import { Room } from '../../../../core/models/university.model';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Gestion des Salles</h2>
          <p class="text-slate-500">Gérez l'infrastructure physique et les capacités des salles.</p>
        </div>
        <app-button icon="pi-plus">Ajouter une salle</app-button>
      </div>

      <app-card>
        <div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col sm:flex-row gap-3 flex-1 max-w-xl">
             <app-input placeholder="Rechercher une salle ou un bâtiment..." icon="pi-search" class="flex-1"></app-input>
             <select class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
               <option value="all">Tous les types</option>
               <option value="LECTURE_HALL">Amphithéâtre</option>
               <option value="CLASSROOM">Salle de classe</option>
               <option value="LAB">Laboratoire</option>
             </select>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let room of rooms$ | async" 
               class="rounded-lg border border-slate-200 bg-white p-5 hover:border-blue-500 hover:shadow-md transition-all group">
            <div class="flex justify-between items-start mb-4">
              <div [class]="'h-10 w-10 rounded-lg flex items-center justify-center ' + (room.type === 'LECTURE_HALL' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600')">
                <i [class]="'pi ' + (room.type === 'LECTURE_HALL' ? 'pi-building' : 'pi-desktop')"></i>
              </div>
              <span [class]="'text-[10px] font-bold px-2 py-0.5 rounded-full ' + (room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700')">
                {{ room.status }}
              </span>
            </div>
            <h3 class="font-bold text-slate-900">{{ room.name }}</h3>
            <p class="text-xs text-slate-500 mb-4">{{ room.building }}</p>
            
            <div class="flex items-center justify-between text-xs border-t border-slate-100 pt-4">
              <div class="flex items-center gap-1.5 text-slate-600">
                <i class="pi pi-users text-slate-400"></i>
                <span class="font-medium">{{ room.capacity }} places</span>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-slate-400 hover:text-blue-600"><i class="pi pi-pencil"></i></button>
                <button class="text-slate-400 hover:text-red-600"><i class="pi pi-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `
})
export class RoomsComponent implements OnInit {
  rooms$!: Observable<Room[]>;

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.rooms$ = this.universityService.getRooms();
  }
}
