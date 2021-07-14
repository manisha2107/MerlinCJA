import { LightningElement, api, track } from 'lwc';

import getInsurancePolicy from '@salesforce/apex/PresentQuote.getInsurancePolicy';
//import getAccountRecord from '@salesforce/apex/PersonInformation.getAccountRecord';
import getTax from '@salesforce/apex/PresentQuote.getTax';

import getPPD from '@salesforce/apex/PresentQuote.getPPD';


export default class Quote extends LightningElement {

    @api fourthchildcompname = 'Fourth component in quote';
    @api fourthcildcompdescription = 'Description of quote';
    @api quotecomp = "True";
    @api quotedescription = "True";
    @track accRecord;
    @track myName;
    @track address;
    @track productName = 'Financial Advisors';
    @track phone;
    @track totalPA = 0;
    @track ArraybillingState = [];
    @track JSONPPD = [];
    @track Discount = 0;
    @track ArrayPremium = [];
    @track error;
    @track accList;
    @track PremiumAmount;
    @track policyFee = 50;
    @track Tax = 0;
    @track policy;
    @track ppds;
    @track sumofamount;
    @track invoiceandinvlineobj;
    @track SplitProductName=[]
    @track FinalNetPremiumArray=[]
    @track Net_Premium="Net Premium Amount"



    @track columns = [{
        label: 'Policy Product Name',
        fieldName: 'Policy_Product_Name__c',
        type: 'text',
        
    },
    {
        label: 'Policy Limit',
        fieldName: 'Policy_Limit__c',
        type: 'currency',
        
    },
    {
        label: 'Aggregate',
        fieldName: 'Aggregate__c',
        type: 'currency',
        
    },
    {
        label: 'Deductible Amount',
        fieldName: 'DeductibleAmount',
        type: 'currency',
        
    },
    {
        label: 'Premium Amount',
        fieldName: 'PremiumAmount',
        type: 'currency',
        
    }
    ];
    //columns for fee table
    // @track FeeData = [
    //     {
    //         "Fees": "Policy Insurance Fees",
    //         "Amount": "$50.00",
    //     },
    //     {
    //         "Fees": "TotalFees",
    //         "Amount": "$50.00",
    //     }];

    @track Description = [];


    //column total premium
    @track SumPremium = [
        {
            label: 'Description',
            fieldName: 'des',
            type: 'Text',
            
        },
        {
            label: 'Total Premium',
            fieldName: 'premium',
            type: 'currency',
            
        }];

    //column for fees



    // wiredAccounts({
    //     error,
    //     data
    // }) {

    //     if (data) {
    //         this.accList = data;
    //     } else if (error) {
    //         this.error = error;
    //     }
    // }
@track Transaction_Fee="Transaction Fee"

@track tableBox
@track TransactionChargesArray=[]
newAmount
prevAmount
    @api
    childFunction(accRecord, policy, ListofPPD, transactionfee,design,newAmount) {

        ListofPPD = ListofPPD.sort(this.compareName);

        console.log('connected called:::::::: ' + JSON.stringify(ListofPPD));
        console.log('connected called:::::::: ' + JSON.stringify(policy));
        this.tableBox="overflow-auto"
        this.policy = policy
        this.PP=policy.PremiumAmount
        console.log('This. PP')
        this.newAmount = newAmount
        console.log('this.newAmount')
        this.prevAmount = policy.PremiumAmount
        console.log('this.prevAmount')
        this.policy[0].PremiumAmount = newAmount
        console.log('this.policy[0].PremiumAmount ')
        this.JSONPPD = ListofPPD
        
        console.log('Policy called:::::::: ' + JSON.stringify(policy));
        this.TransactionFee= transactionfee
        console.log('TransactionFee ====>>'+this.TransactionFee)

        if(this.TransactionFee ==undefined){
            this.TransactionFee=0
            this.TransactionChargesArray.push({
                'Transaction_Charges':this.TransactionFee,
                'Transaction_Fee': 'Transaction Fee'
                })
                console.log('IF Chargesssss::>> '+JSON.stringify(this.TransactionChargesArray))
        
                
                this.TransactionChargesArray = [{
                    'Transaction_Fee': 'Transaction Fee',
                    'Transaction_Charges':this.TransactionFee
                }]
        
        }
        else{
            this.Transaction_Charges=this.TransactionFee
            this.Transaction_Fee='Transaction Fee'
            this.TransactionChargesArray.push({
                'Transaction_Charges':this.TransactionFee,
                'Transaction_Fee': 'Transaction Fee'
                })
                console.log('ELSE Chargesssss::>> '+JSON.stringify(this.TransactionChargesArray))
        
                
                this.TransactionChargesArray = [{
                    'Transaction_Fee': 'Transaction Fee',
                    'Transaction_Charges':this.TransactionFee
                }]
        
        }

        /////////////////////

        
        /////////////////////
        
        
        
        

        this.accRecord = accRecord;
        console.log('account Record is:: '+JSON.stringify(accRecord))
        this.accPhone= accRecord.Phone;
        console.log('Policy::' + JSON.stringify(policy));
        console.log('Policy Id::' + JSON.stringify(ListofPPD[0].InsurancePolicyId));
        console.log("Child LWC Component method invoked");
        console.log('Connected Call from Child Method');

        this.calculateDiscount(policy[0]);
        this.getTaxCalculation(accRecord, policy[0]);

        this.getHeaderInfo(policy[0], accRecord);

        //Maaz 15/2/2020 for total premium amount 
        
                
        
    }


    @track FeeCloumns = [{

        label: 'Fee',
        fieldName: 'Transaction_Fee',
        type: 'text'
        
        },
        {
            label: 'Amount',
            fieldName: 'Transaction_Charges',
            type: 'currency'
        }]

       

    getHeaderInfo(policy, accRecord) {

        try {


            console.log('result with address ===> ' + JSON.stringify(policy));
            this.myName = accRecord.FirstName + ' ' + accRecord.LastName;
            console.log('person name :: ' + this.myName);
            this.address = accRecord.BillingStreet + ' '
                + accRecord.BillingCity
                + ' ' + accRecord.BillingState
                + ' ' + accRecord.BillingPostalCode
                + ' ' + accRecord.BillingCountry;
            console.log('address :: ' + this.address);
            this.policyTerm= policy.Policy_Terms__c
            console.log('Policy terms are:'+this.policyTerm)
            this.effectiveDate= policy.EffectiveDate
            console.log('effective date is:::'+ policy.EffectiveDate)
            //this.policyName=policy.PolicyName
            //console.log("Policy Name is::"+ this.policyName)


            this.SplitProductName.push(policy.Name)
            console.log('SPPPLLLIITTT::'+ this.SplitProductName)
            this.SplitProductName= this.SplitProductName[0].split('-')
            console.log('SPLLITTT::::::='+this.SplitProductName[1])
            this.ProductName=this.SplitProductName[1];
            
            //console.log("SPLIT NAME:::"+this.productNameArray[0])
            console.log("SPLIT NAME:::"+this.ProductName[0])


            console.log('person name :: ' + this.myName);
            console.log('address :: ' + this.address);
            console.log('Account Record ::' + JSON.stringify(accRecord));


        } catch (error) {

            console.log('Error::' + JSON.stringify(error));
        }

    }


    getTodayDate(){
        let rightNow = new Date();

        // Adjust for the user's time zone
        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );

        // Return the date in "YYYY-MM-DD" format
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        return(yyyyMmDd)
        }


    getDate(){

        //2021-01-22T17:00:00.000Z (from salesforce record)    
        let date = new Date();
        date.toISOString().slice(0, -5)

        return(date)

        }    


    getTaxCalculation(accRecord, policy) {

        console.log('Get Tax' + accRecord.BillingState);
        var billState = accRecord.BillingState;
        getTax({ BillingState: billState })

            .then(Taxresult => {

                console.log('Tax Result::' + Taxresult);
                this.TaxRes=Taxresult;
                this.polAmo=policy.PremiumAmount
                this.ProvinceWithTax=  billState + ' (' + Taxresult + '%)'
                
                this.SecondRowOfTax="Net Premium"
                this.ArraybillingState = [{
                    'premium': Taxresult,
                    'des': billState + '(' + Taxresult + '%)'

                }];


                //Maaz
                

                console.log('TAX OF STATE IS::'+ this.TaxRes)

                if(this.TaxRes>0 && policy.PremiumAmount>0){
                    this.TaxAppliedIn= Number((policy.PremiumAmount)*(this.TaxRes)/100)
                    this.TaxApplied= Number(this.TaxAppliedIn + policy.PremiumAmount)
                    console.log('THIS IS TAX PREMIUM::'+this.TaxApplied)
                    // this.ArrayTotalNetPremium.push({
                    //     Tax_Premium: this.TaxPremium
                    // })
                this.FinalNetPremium = Number(this.TaxApplied+this.TransactionFee)
                console.log("FINAL NET PREMIUM::"+this.FinalNetPremium)

                // this.FinalNetPremiumArray.push({
                //     'NetPremium': this.Net_Premium,
                //     'finalPremium_c' : this.FinalNetPremium
                // })
                //Maaz
                }
                else{
                        this.TaxAppliedIn=0;
                        this.TaxApplied= Number(Taxresult*policy.PremiumAmount)

                        if(!this.TransactionFee){
                            this.TransactionFee=0
                        }

                        if(!policy.PremiumAmount){
                            policy.PremiumAmount=0
                        }
                        console.log("Amount To be Added of PA::"+policy.PremiumAmount)
                        console.log("Amount To be Added of PA::"+this.TransactionFee)
                        policy.PremiumAmount= Number(policy.PremiumAmount)
                        this.TransactionFee= Number(this.TransactionFee)
                        console.log("Amount To be Added of PA Number::"+policy.PremiumAmount)
                        console.log("Amount To be Added of PA Number::"+this.TransactionFee)
                        
                        this.FinalNetPremium= Number(policy.PremiumAmount+this.TransactionFee)


                        this.FinalNetPremiumArray.push({
                        'finalPremium_c' :this.NETPremiumAmount,
                        'NetPremium': "Total Net Premium"
                    });
                    console.log("Aray Final::"+JSON.stringify(this.FinalNetPremiumArray))   
                }
                

                console.log('Policy Record::' + JSON.stringify(policy));

                console.log('Array billing state::' + JSON.stringify(this.ArraybillingState));

                if (Taxresult > 0) {

                    console.log('Tax is greater than 0');

                    this.ArraybillingState.push({
                        'premium': (Taxresult * (policy.PremiumAmount - this.Discount)) / 100,
                        'des': 'Net Premium'

                    });

                }

                else {


                    console.log('Policy' + JSON.stringify(policy));

                    console.log(
                        'Policy Premium Amount' + policy.PremiumAmount
                    );
                    console.log(
                        'Discount' + this.Discount
                    );
                    this.ArraybillingState.push({
                        'premium': policy.PremiumAmount - this.Discount,
                        'des': 'Net Premium'

                    });
                }

                console.log('Array billing state::' + JSON.stringify(this.ArraybillingState));

            }).catch(TaxError => {

                console.log(
                    'Tax Error' + JSON.stringify(TaxError)
                );

            })
    }

//total amounts on quote by Maaz 15/2/2020
@track TotalQuoteAmounts= [{
    label: 'Detail',
    fieldName: 'finalPremium_c',
    type: 'currency'
    },
    {
    label: 'Amount Detail',
    fieldName: 'NetPremium',
    type: 'text'
    }]
//total amounts on quote by Maaz 15/2/2020


  
    calculateDiscount(policy) {

        this.ArrayPremium = [{ 'premium': 0, 
                                'des': 'Total Amount Of Premium'
                             }]

        console.log('Premium Amount::' + policy.PremiumAmount);

        this.ArrayPremium[0].premium = policy.PremiumAmount

        console.log('Premium AMount::' + this.ArrayPremium[0].premium);
        console.log('Array Premium::' + JSON.stringify(this.ArrayPremium));
        console.log('Result Discount::' + policy.Discount);


        if (policy.Discount) {

            console.log('DIscount is not undefined::' + policy.Discount);

            this.Discount = policy.Discount;

            this.ArrayPremium = [{

                'premium': '(' + policy.Discount + ')',
                'des': 'Newly Licensed Discount Amount'
            }];

            this.ArrayPremium.push({

                'premium': policy.PremiumAmount - policy.Discount,
                'des': 'Net Premium'
            });


            console.log('Discount ::' + JSON.stringify(this.ArrayPremium));

        }

        


    }
 


    // @track TaxCloumns = [{

    //     label: 'Tax State',
    //     fieldName: 'premium',
    //     type: 'text',
    //     sortable: true
    // }
    // ]

    handleQuoteClick() {

       console.log('Navigate to Quote');


        var InvoicelineArray=[];
        console.log(this.policy[0].PremiumAmount);
        console.log('Discount::' + this.Discount);
        console.log('this.Tax' + this.Tax);
        console.log('this.policyFee' + this.policyFee);
        console.log('this.premiumAmount' +this.policy[0].PremiumAmount);

        InvoicelineArray.push({

            'invid': '',
            'rate': this.policy[0].PremiumAmount,
            'quantity': 1,
            'linenotes': 'Premium Amount'
        })

        if (this.Discount) {
            InvoicelineArray.push({

                'invid': '',
                'rate': this.Discount,
                'quantity': -1,
                'linenotes': 'Discount'
            })
        }
        InvoicelineArray.push({

            'invid': '',
            'rate': this.Tax,
            'quantity': 1,
            'linenotes': 'Tax'
        })
        InvoicelineArray.push({

            'invid': '',
            'rate': this.policyFee,
            'quantity': 1,
            'linenotes': 'Policy Fee'
        })


        console.log('Account Id::' + this.accRecord.Id);

        console.log('Account Id::' + this.accRecord.PersonEmail);

        console.log('Invoice Line Items => ' + InvoicelineArray);

    this.sumofamount = this.policy[0].PremiumAmount - (this.Discount) + this.Tax + this.policyFee;

    console.log('sum of invoice amount :: ' +  this.sumofamount);
        
    var accountId = this.accRecord.Id;
    var accountEmail = this.accRecord.PersonEmail;
    var policyId = this.JSONPPD[0].InsurancePolicyId;

//    console.log('account id::'+ accountId + 'account Email:'+ accountEmail + 'policyId::'+ policyId);

     this.invoiceandinvlineobj = {accid:this.accRecord.Id,
        accEmail:this.accRecord.PersonEmail,
        policyId:this.JSONPPD[0].InsurancePolicyId,
        curr:'CAD',
        invamount:this.sumofamount,
        invnotes:'Purchase Policy Invoice',
        invoicetype:'Purchase Policy',
        listofInvLineItems:InvoicelineArray
   
         };


        console.log('Invoice Obj ahad::' + JSON.stringify(this.invoiceandinvlineobj));

        //var opportunityWrapper;
       let opportunityWrapper = {
            name:this.accRecord.FirstName + ' ' + this.accRecord.LastName + ' - ' + 'Purchase Policy',
            recordtypeDevName: 'Renewal_Opportunity',
            accountid: this.accRecord.Id,
            type: 'Purchase Policy',
            policyId: this.policy[0].Id,
            productId: this.policy[0].ProductId,
            //    quoteId:this.quoteid,
            broker: this.policy[0].Broker__c,
            brokerage: this.policy[0].Brokerage__c,
            commission: this.policy[0].Commission__c,
            amount: this.sumofamount,
            discount: this.Discount,
            policyfee: this.policyFee,
            stage: 'Closed Won',
            closedate:this.getTodayDate()
        }

        console.log("POLICY FEE IS::>> "+this.policyFee)
        console.log('Opportunity Wrapper Obj::' + JSON.stringify(opportunityWrapper));
      
        for (let i = 0 ; i< this.policy.length; i++){

            
            this.policy[i].Status = 'Active' 
            this.policy[i].EffectiveDate = this.getDate()       

        }

         
        for (let i = 0 ; i< this.JSONPPD.length; i++){

            
            this.JSONPPD[i].Status__c = 'Active' 
            this.JSONPPD[i].EffectiveDate = this.getDate()       

        }

        this.policy[0].PremiumAmount = this.prevAmount
        const evt = new CustomEvent('myfourthevent', {
            detail: {
                fourthchildcompname: this.fourthchildcompname,
                fourthcildcompdescription: this.fourthcildcompdescription,
                amount:this.FinalNetPremium,
                invoiceandlineobj:this.invoiceandinvlineobj,
                OppWrapper:opportunityWrapper,
                ppdtoActivate : this.JSONPPD,
                policyObject : this.policy,
                accountfullname : this.accRecord.FirstName + ' ' + this.accRecord.LastName,
                accountFirstName : this.accRecord.FirstName,
                accountLastName : this.accRecord.LastName,
                accountemail : this.accRecord.PersonEmail,
                brokerage : this.policy[0].Brokerage__c
            }
        });

        console.log('Event Called::' + JSON.stringify(evt));

        console.log('--------------------------------------------')
        console.log('--------------------------------------------')
        console.log('--------------------------------------------')
        console.log('--------------------------------------------')
        console.log('--------------------------------------------')
        console.log('--------------------------------------------')

        console.log('Policy Object:: ' + JSON.stringify(this.policy) + 'Policy PPD Object:: ' + JSON.stringify(this.JSONPPD));

        this.dispatchEvent(evt);

    }

    PrintQuote() {

        window.print();
    }


    ExitQuote() {

        const evt = new CustomEvent('quoteevent', { detail: { quotecomp: this.quotecomp, quotedescription: this.quotedescription } });
        this.dispatchEvent(evt);

    }


    compareName(a, b) {

        // converting to uppercase to have case-insensitive comparison
        const name1 = Number(a.PremiumAmount);
        const name2 = Number(b.PremiumAmount);
    
        let comparison = 0;
    
        if (name1 < name2) {
            comparison = 1;
        } else if (name1 > name2) {
            comparison = -1;
        }
        return comparison;
    }

}