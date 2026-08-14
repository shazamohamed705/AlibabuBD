import { useState } from 'react';
import { Field, SelectField, ContinueBtn, formStyles } from './CheckoutForm';
import { useTheme } from '../../context/ThemeContext';

const GOVERNORATES = ['Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan', 'Sharm El-Sheikh', 'Hurghada', 'Mansoura', 'Tanta', 'Zagazig'];

export default function CheckoutShipping({ data, onNext }) {
  const { dark } = useTheme();
  const [form, setForm] = useState({
    fullName:      data.fullName      || '',
    email:         data.email         || '',
    phone:         data.phone         || '',
    governorate:   data.governorate   || '',
    city:          data.city          || '',
    area:          data.area          || '',
    streetAddress: data.streetAddress || '',
    building:      data.building      || '',
    notes:         data.notes         || '',
  });

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className={`co-step bg-white rounded-2xl p-6 lg:p-8 ${dark ? 'co-dark' : ''}`}>
      <style>{formStyles}</style>
      <h2 className="font-display text-2xl font-light text-[#1a1612] mb-6"
        style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Shipping Address</h2>

      <form onSubmit={e => { e.preventDefault(); onNext(form); }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Field label="Full Name"     name="fullName"      value={form.fullName}      onChange={set} placeholder="Your full name"          colSpan={2} />
        <Field label="Email Address" name="email"         value={form.email}         onChange={set} placeholder="you@email.com"            type="email" />
        <Field label="Phone Number"  name="phone"         value={form.phone}         onChange={set} placeholder="+20 1xx xxx xxxx"         type="tel" />
        <SelectField label="Governorate" name="governorate" value={form.governorate} onChange={set} options={GOVERNORATES} />
        <Field label="City"          name="city"          value={form.city}          onChange={set} placeholder="City name" />
        <Field label="Area / District" name="area"        value={form.area}          onChange={set} placeholder="Area or district"          colSpan={2} />
        <Field label="Street Address"  name="streetAddress" value={form.streetAddress} onChange={set} placeholder="Street name and number" colSpan={2} />
        <Field label="Building"      name="building"      value={form.building}      onChange={set} placeholder="Building name / number"   colSpan={2} />
        <Field label="Delivery Notes (Optional)" name="notes" value={form.notes}    onChange={set} placeholder="Any special delivery instructions..." required={false} colSpan={2} />

        <div className="sm:col-span-2">
          <ContinueBtn />
        </div>
      </form>
    </div>
  );
}
