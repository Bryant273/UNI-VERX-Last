import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supervision',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supervision.component.html',
  styles: [`
    .sys-map { position: relative; width: 100%; height: 400px; background: #0f172a; border-radius: 8px; overflow: hidden; margin-top: 20px;}
    .node { position: absolute; padding: 10px 15px; border-radius: 8px; background: #1e293b; color: white; border: 2px solid #334155; text-align: center; font-weight: bold; width: 140px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: all 0.3s; }
    .node.attacker { border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    .node.gateway { border-color: #3b82f6; }
    .node.defender { border-color: #eab308; background: rgba(234, 179, 8, 0.1); }
    .node.stable { border-color: #22c55e; }
    
    .pulse-red { animation: pulseRed 1s infinite; }
    @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
    
    .flow-lines { position: absolute; top:0; left:0; width:100%; height:100%; }
    .node-label { white-space: pre-line; }
  `]
})
export class SupervisionComponent implements OnInit {
  chaosMode: 'TEST' | 'PROD' | 'OFF' = 'OFF';
  events: string[] = [];

  nodes = [
    { id: 'chaos', name: 'Chaos Engine\n(Attaquant)', class: 'node attacker', x: 50, y: 150 },
    { id: 'gateway', name: 'Go Gateway\n(Adaptive Shield)', class: 'node gateway pulse-red', x: 300, y: 150 },
    { id: 'rust', name: 'Rust Analyzer\n(Predictive IP)', class: 'node defender', x: 550, y: 50 },
    { id: 'java', name: 'Java Business\n(Optimizer)', class: 'node stable', x: 550, y: 250 },
    { id: 'ai', name: 'Blue AI\n(Apprentissage)', class: 'node gateway', x: 800, y: 150 },
  ];

  ngOnInit() {
    this.addEvent("Système d'Initialisation: En attente de télémétrie Redis...");
  }

  toggleChaos(mode: 'TEST' | 'PROD' | 'OFF') {
    this.chaosMode = mode;
    this.addEvent(`Commande envoyée : Mode Chaos basculé sur [${mode}]`);
    // HTTP call would go here
  }

  private addEvent(msg: string) {
    this.events.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
    if (this.events.length > 10) this.events.pop();
  }
}
