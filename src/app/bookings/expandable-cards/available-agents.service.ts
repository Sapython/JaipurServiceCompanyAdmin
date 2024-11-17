import { Injectable } from '@angular/core';
import { AgentsService } from 'src/app/agents/agents.service';
import moment from 'moment';
import { Slot, extendedAgent, extendedSlot } from './available-agents.structure';

@Injectable({
  providedIn: 'root'
})
export class AvailableAgentsService {
    availableAgents: any[] = [];
    constructor(
        private agentService: AgentsService
    ) {

    }

    async getAllAgents(date: string) {
        await this.agentService.getAllAgentsSubscription().subscribe((agents) => {
            this.availableAgents = [];
            agents.map(async (agent: any) => {
                let agentsData = {...agent, slots: <any>[], present: 'NA' } as extendedAgent;
                agentsData.subscription?.unsubscribe();
                await this.agentService.getAgentsSlotsSubscription(agent['id']).subscribe((slots) => {
                    agentsData.slots = slots as Slot[];
                    slots.map((slot: any) => {
                        if (date === slot.id) {
                            agentsData.present = slot.working ? 'P' : 'A'
                        }
                    });
                });
                this.availableAgents.push(agentsData);
                return agentsData;
            });
        });
    }

    async getAvailableAgents(date: string) {
        await this.getAllAgents(date);
        return this.availableAgents;
    }
}