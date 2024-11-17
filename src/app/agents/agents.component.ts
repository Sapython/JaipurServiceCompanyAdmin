import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AgentInfo } from './agents.structure';
import { AgentsService } from './agents.service';
import { Dialog } from '@angular/cdk/dialog';
import moment from "moment";

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {
  constructor(
    private customerService: AgentsService,
    private dialog: Dialog
  ){}
  customers: AgentInfo[] = [];
  filteredCustomers: AgentInfo[] = [];
  selectedAgent: any;
  @ViewChild('agentDetail') agentDetail: TemplateRef<any> | undefined;

  ngOnInit(): void {
    this.getAgents();
  }

  getAgents() {
    this.customerService.getAgents().then((customers:AgentInfo[])=>{
      this.customers = customers;
      this.filteredCustomers = customers;
      console.log(this.customers);
    });
  }

  get todaysAgents() {
    const today = moment(new Date()).format('YYYY-MM-DD');
    return this.customers.filter((agent) => {
      if (agent.registerDate) {
        if (moment(new Date(agent.registerDate.seconds * 1000)).format('YYYY-MM-DD') === today) {
          return agent;
        }
      }
      return null;
    }).length;
  }

  get activeAgents() {
    return this.customers.filter(agent => agent.active === true).length;
  }

  get totalAcceptanceFee() {
    return this.customers.reduce((acc, agent) => acc + agent.totalAcceptanceAmount, 0)
  }

  get todaysTotalAcceptanceFee() {
    return this.customers.reduce((acc, agent) => acc + agent.totalAcceptanceAmountToday, 0)
  }

  get avgAcceptanceFee() {
    const totalCompletedBookings = this.customers.reduce((acc, agent) => acc + agent.completedBookings, 0);
    const fee = this.totalAcceptanceFee / totalCompletedBookings;
    return isNaN(fee) ? 0 : fee.toFixed(2);
  }

  get todaysAvgAcceptanceFee() {
    const todaysTotalCompletedBookings = this.customers.reduce((acc, agent) => acc + agent.completedBookingsToday, 0);
    const fee = this.todaysTotalAcceptanceFee / todaysTotalCompletedBookings;
    return isNaN(fee) ? 0 : fee.toFixed(2);
  }

  async changeAgentStatus(agentId: string, status: boolean) {
    await this.customerService.updAgentStatus(agentId, status);
    this.getAgents();
  }

  filterAgents($event: any) {
    let val = $event.target.value;
    if (!val) {
      this.filteredCustomers = this.customers;
      return;
    }
    val = val.toLowerCase();
    this.filteredCustomers = this.customers.filter((agent) => {
      if (agent.name.toLowerCase().indexOf(val) > -1 || agent.phone.toLowerCase().indexOf(val) > -1) {
        return agent;
      }
      return null;
    });
  }

  openDetails(agent: any) {
    this.selectedAgent = agent;
    this.agentDetail && this.dialog.open(this.agentDetail, {
      width: '500px',
      height: '90vh',
   });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
