import { type RouteComponent } from '@ben-js/router'
import { html, reactive } from 'ben-js'

import { Btn } from '~/lib/components/Btn'
import { Form } from '~/lib/components/form/Form'
import { FormContainer } from '~/lib/components/form/FormContainer'
import { Input } from '~/lib/components/form/Input'
import { Select } from '~/lib/components/form/Select'

const StepFormPage: RouteComponent = () => {
  const data = reactive({
    email: '',
    firstName: '',
    gender: '',
    lastName: '',
  })

  return html`<div class="std-container">
    ${FormContainer(
      Form(
        {
          onSubmit: ev => {
            ev.preventDefault()
            console.log('submit')
            console.log(data.value)
          },
        },
        Input({
          autocomplete: 'email',
          label: 'Email',
          name: 'email',
          placeholder: 'Email',
          onUpdate: email => (data.value.email = email),
        }),
        Input({
          autocomplete: 'given-name',
          label: 'First Name',
          name: 'first-name',
          placeholder: 'First name',
          onUpdate: firstName => (data.value.firstName = firstName),
        }),
        Input({
          autocomplete: 'family-name',
          label: 'Last Name',
          name: 'last-name',
          placeholder: 'Last name',
          onUpdate: lastName => (data.value.lastName = lastName),
        }),
        Select({
          autocomplete: 'gender',
          label: 'Gender',
          name: 'gender',
          options: [
            {
              default: true,
              disabled: true,
              label: 'Select',
              selected: true,
              value: '',
            },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ],
          placeholder: 'Select gender',
          onUpdate: gender => (data.value.gender = gender),
        }),
        Btn(
          {
            type: 'submit',
          },
          'Submit',
        ),
      ),
    )}
    </div>
  </div>`
}

export default StepFormPage
