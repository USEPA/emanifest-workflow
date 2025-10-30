// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    steps: [
      {
        order: 1, value: 'Draft', status: 'Draft',
        description: 'Nothing is really required except a site ID for one of the handlers to save and associate the manifest to. The manifest is accessible only to the site that creates it.'
      },
      {
        order: 2, value: 'Pending', status: 'Pending',
        description: 'At least one site must be added to the manifest. The manifest is shared with all parties selected on the manifest.'
      },
      {
        order: 3, value: 'Scheduled', status: 'Scheduled',
        description: 'All handlers and draft waste information are required. The official DOT-compliant shipping paper can be printed from the system.'
      },
      {
        order: 4, value: 'GenSig', status: 'Generator Signature',
        description: 'Provide final waste information before generator signs.'
      },
      {
        order: 5, value: 'TSig', status: 'Transporter Signature',
        description: 'Generator must sign prior to initial transporter signature.'
      },
      {
        order: 6, value: 'InTransit', status: 'In Transit',
        description: 'Additional transporters can be added and they must sign in order.'
      },
      {
        order: 7, value: 'TsdfReceipt', status: 'TSDF Receipt',
        description: 'The designated facility may sign once the final transporter has signed. The status in the system is Ready For Signature prior to signing..'
      },
      {
        order: 8, value: 'Submit', status: 'Final Submission',
        description: 'Management Method Codes are required for federally hazardous waste. The status in the system will be either Ready For Signature or Signed before final signature'
      }
    ],
    currentStep: 0,
    fields: {
      mtn: { id: 'mtn', label: 'Manifest Tracking Number', required: 'Pending', value: '123456789ELC', locked:'Pending' },
      erPhone: { id: 'erPhone', label: 'Emergency Response Phone', required: 'Scheduled', value: '888-333-2224', locked:'GenSig' },
      generator: {
        epaId: { id: 'genId', label: 'EPA ID Number', required: 'Scheduled', value: 'VA123456789', locked:'GenSig' },
        name: { id: 'genName', label: 'Name', required: 'Scheduled', value: 'Test Generator', locked:'GenSig' },
        phone: { id: 'genPhone', label: 'Generator\'s Phone', required: 'Scheduled', value: '555-333-3321', locked:'GenSig' },
        mailingAddress: { id: 'genMailAddress', label: 'Mailing Address', required: 'Scheduled', value: '123 Main St \r Fairfax, VA 22033' , locked:'GenSig'},
        siteAddress: { id: 'genSiteAddress', label: 'Site Address', required: 'Scheduled', value: '321 W Broad St \r Fairfax, VA 22033', locked:'GenSig' },
        signature: {
          name: { id: 'genSigName', label: 'Name', required: 'GenSig', value: 'Gen Erator', locked:'GenSig' },
          date: { id: 'genSigDate', label: 'Date', required: 'GenSig', value: '10/20/2025', locked:'GenSig' }
        }
      },
      transporter: {
        signature: {
          name: { id: 'transporterSigName', label: 'Name', required: 'TSig', value: 'Trans Porter', locked:'TSig' },
          date: { id: 'transporterSigDate', label: 'Date', required: 'TSig', value: '10/20/2025', locked:'TSig' }
        }
      },
      tsdf: {
        epaId: { id: 'tsdfId', label: 'EPA ID Number', required: 'Scheduled', value: 'NC123456789', locked:'TsdfReceipt' },
        name: { id: 'tsdfName', label: 'Name', required: 'Scheduled', value: 'Test TSDF', locked:'TsdfReceipt' },
        phone: { id: 'tsdfPhone', label: 'Facility\'s Phone', required: 'Scheduled', value: '774-233-6643', locked:'TsdfReceipt' },
        siteAddress: { id: 'tsdfSiteAddress', label: 'Site Address', required: 'Scheduled', value: '321 W Broad St \r Raleigh, NC 21155', locked:'TsdfReceipt' },
        signature: {
          name: { id: 'tsdfSigName', label: 'Name', required: 'TsdfReceipt', value: 'T SDF', locked:'TsdfReceipt'},
          date: { id: 'tsdfSigDate', label: 'Date', required: 'TsdfReceipt', value: '10/25/2025', locked:'TsdfReceipt' }
        }
      },
      waste: {
        line: { optional: true },
        haz: { required: 'Scheduled' },
        description: { required: 'Scheduled' },
        containerNumber: { required: 'Scheduled' },
        containerType: { required: 'Scheduled' },
        quantity: { required: 'Scheduled' },
        uom: { required: 'Scheduled' },
        wasteCodes: { required: 'Scheduled' }
      },
       managemementMethod1: { id: 'managemementMethod1', label:"1", required: 'Submit', value: 'H040' },
       managemementMethod2: { id: 'managemementMethod2', label:"2", required: 'Submit', value: 'H041' },
       managemementMethod3: { id: 'managemementMethod3', label:"3", required: 'Submit', value: '' },
       managemementMethod4: { id: 'managemementMethod4', label:"4",required: 'Submit', value: '' }
    },
    tooltips:{
      waste:'Draft waste information must be provided for the Scheduled status. Prior to Generator signing, the waste information needs to be finalized and uploaded',
      generator:'If manifest type is Hybrid, the Generator signs on paper and the transporter is responsible for uploading prior to signing electronically',
      wasteWarning:'Waste information generally should not be changed after generator signature with exception to situations allowed in the regulations',
      tsdfWarning:'The designated facility generally should not be changed after generator signature with exception to situations allowed in the regulations'
    }
  }),
  getters: {
    lookupStatus: (state) => (value) => {
      return state.steps.find(step => step.value == value)
    },
    lookupStatusId: (state) => (value) => {
      return state.steps.find(step => step.value == value).order
    },
    currentStatus: (state) => {
      return state.steps.find(step => step.order == state.currentStep + 1)
    },
    lookupField: (state) => (field) => {
      if (field.includes('.')) {
        return field.split('.').reduce((acc, part) => {
          return acc && typeof acc === 'object' && acc[part] !== undefined ? acc[part] : undefined;
        }, state.fields);
      }
      return state.fields[field]
    },
    getTooltip:(state) => (tip) =>{
      console.log(tip)
      return state.tooltips[tip]
    }
  },
  actions: {
  }
})
