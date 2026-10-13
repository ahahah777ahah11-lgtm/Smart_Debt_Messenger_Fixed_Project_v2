(() => {
  "use strict";
  const KEY = "smartDebtCustomers_v1";
  const $ = id => document.getElementById(id);
  let customers = load();
  function load(){ try { const v=JSON.parse(localStorage.getItem(KEY)||"[]"); return Array.isArray(v)?v:[]; } catch(e){ return []; } }
  function persist(){ try { localStorage.setItem(KEY,JSON.stringify(customers)); } catch(e){ alert("تعذر حفظ البيانات. صدّر نسخة احتياطية واحذف بعض البيانات."); } render(); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = n => Number(n||0).toLocaleString("en-US",{maximumFractionDigits:2});
  function render(){
    const total=customers.reduce((s,c)=>s+Math.max(0,Number(c.debt)||0),0);
    $("totalDebt").textContent=money(total); $("customerCount").textContent=customers.length;
    $("debtorsCount").textContent=customers.filter(c=>Number(c.debt)>0).length;
    const q=$("search").value.trim().toLowerCase();
    const shown=customers.filter(c=>(c.name+" "+c.phone+" "+(c.notes||"")).toLowerCase().includes(q));
    $("customerList").innerHTML=shown.map(c=>`<div class="customer-row"><div class="customer-info"><h3>${esc(c.name)}</h3><p>📞 ${esc(c.phone)}</p><p>الرصيد: <span class="balance ${Number(c.debt)<=0?"zero":""}">${money(c.debt)} ريال</span></p>${c.notes?`<p>${esc(c.notes)}</p>`:""}</div><div class="actions"><a class="action sms" href="${smsUrl(c)}">SMS</a><a class="action wa" target="_blank" rel="noopener" href="${waUrl(c)}">واتساب</a><button class="action edit" data-edit="${esc(c.id)}">تعديل</button><button class="action delete" data-delete="${esc(c.id)}">حذف</button></div></div>`).join("");
    $("emptyState").hidden=shown.length>0;
    $("customerList").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));
    $("customerList").querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>removeCustomer(b.dataset.delete));
  }
  function message(c){return `مرحبًا ${c.name}، نذكّركم بأن الرصيد المستحق في حسابكم هو ${money(c.debt)} ريال. إذا تم السداد يرجى تجاهل الرسالة. شكرًا لكم.`;}
  function smsUrl(c){return "sms:"+encodeURIComponent(c.phone)+"?body="+encodeURIComponent(message(c));}
  function waUrl(c){let p=c.phone.replace(/[^\d+]/g,"").replace(/^\+/,"");return "https://wa.me/"+p.replace(/\D/g,"")+"?text="+encodeURIComponent(message(c));}
  function clearForm(){ $("customerForm").reset(); $("customerId").value=""; $("debt").value="0"; $("saveBtn").textContent="حفظ العميل"; }
  $("customerForm").addEventListener("submit",e=>{e.preventDefault();const id=$("customerId").value||String(Date.now())+Math.random().toString(16).slice(2);const c={id,name:$("name").value.trim(),phone:$("phone").value.trim(),debt:Math.max(0,Number($("debt").value)||0),notes:$("notes").value.trim()};if(!c.name||!c.phone){alert("أدخل اسم العميل ورقم الهاتف.");return;}const i=customers.findIndex(x=>x.id===id);if(i>=0)customers[i]=c;else customers.unshift(c);persist();clearForm();});
  function edit(id){const c=customers.find(x=>x.id===id);if(!c)return;$("customerId").value=c.id;$("name").value=c.name;$("phone").value=c.phone;$("debt").value=c.debt;$("notes").value=c.notes||"";$("saveBtn").textContent="حفظ التعديلات";window.scrollTo({top:0,behavior:"smooth"});}
  function removeCustomer(id){const c=customers.find(x=>x.id===id);if(c&&confirm("هل تريد حذف العميل "+c.name+"؟")){customers=customers.filter(x=>x.id!==id);persist();}}
  $("resetBtn").onclick=clearForm; $("search").addEventListener("input",render);
  $("importBtn").onclick=()=>$("fileInput").click();
  $("fileInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const text=await f.text();const rows=parseCSV(text);let added=0;rows.forEach((r,i)=>{if(i===0&&/اسم|name|customer/i.test((r[0]||"")))return;if(r.length<2||!r[0]||!r[1])return;customers.push({id:String(Date.now())+Math.random().toString(16).slice(2),name:r[0].trim(),phone:r[1].trim(),debt:Math.max(0,Number((r[2]||"0").replace(/,/g,""))||0),notes:(r[3]||"").trim()});added++;});persist();alert("تم استيراد "+added+" عميل.");}catch(err){alert("تعذر قراءة CSV. تأكد من تنسيق الملف.");}e.target.value="";};
  function parseCSV(text){const rows=[];let row=[],field="",quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){field+='"';i++;}else if(c==='"'){quoted=!quoted;}else if(c===","&&!quoted){row.push(field);field="";}else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&text[i+1]==="\n")i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field="";}else field+=c;}row.push(field);if(row.some(x=>x.trim()))rows.push(row);return rows;}
  $("exportBtn").onclick=()=>download("smart-debt-customers.csv","\ufeff"+[["اسم العميل","رقم الهاتف","الرصيد","ملاحظات"],...customers.map(c=>[c.name,c.phone,c.debt,c.notes||""])].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n"),"text/csv;charset=utf-8");
  $("backupBtn").onclick=()=>download("smart-debt-backup.json",JSON.stringify(customers,null,2),"application/json");
  $("restoreBtn").onclick=()=>$("backupInput").click();
  $("backupInput").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data)||!data.every(c=>c&&c.name&&c.phone))throw Error();if(confirm("ستستبدل الاستعادة قائمة العملاء الحالية. هل تريد المتابعة؟")){customers=data.map(c=>({id:String(c.id||Date.now()+Math.random()),name:String(c.name),phone:String(c.phone),debt:Math.max(0,Number(c.debt)||0),notes:String(c.notes||"")}));persist();alert("تمت الاستعادة.");}}catch(err){alert("ملف النسخة الاحتياطية غير صالح.");}e.target.value="";};
  function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  render();
})();