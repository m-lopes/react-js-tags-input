import { MailingList } from '@/models/mailingLists'
import { api } from '@/services/api'

export async function getById(id: string) {
  try {
    const { data } = await api.get<MailingList>(`/mailing-lists/${id}`, {
      headers: {
        token: '3ba1d46f-cdef-aafb-f67e-a0f3bd4b1473',
      },
    })

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      data: {} as MailingList,
    }
  }
}

export async function update(mailingList: MailingList) {
  try {
    const { data } = await api.patch<MailingList>(
      `/mailing-lists/${mailingList.id}`,
      {
        mailingList,
      },
      {
        headers: {
          token: '3ba1d46f-cdef-aafb-f67e-a0f3bd4b1473',
        },
      }
    )

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      data: {} as MailingList,
    }
  }
}
