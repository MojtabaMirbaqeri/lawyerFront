export function useFilters() {
  const visitTypes = [
    {
      title: "حضوری",
      id: "inperson",
      icon: "hugeicons:building-06",
    },
    {
      title: "تلفنی",
      id: "phone",
      icon: "hugeicons:telephone",
    },
    {
      title: "چت آنلاین",
      id: "chat",
      icon: "hugeicons:message-multiple-02",
    },
  ];
  const genders = [
    { title: "مرد", id: "male", icon: "custom:male" },
    {
      title: "زن",
      id: "female",
      icon: "custom:female",
    },
  ];
  const lawyerTypes = [
    {
      id: 0,
      title: "همه",
    },
    {
      id: 1,
      title: "وکیل پایه یک دادگستری",
    },
    {
      id: 2,
      title: "وکیل پایه دو دادگستری",
    },
    {
      id: 3,
      title: "کارآموز وکالت",
    },
    {
      id: 4,
      title: "وکیل تسخیری",
    },
    {
      id: 5,
      title: "وکیل معاضدتی",
    },
    {
      id: 6,
      title: "وکیل اتفاقی",
    },
    {
      id: 7,
      title: "وکیل موضوع ماده 187",
    },
  ];
  const lawyerSpecialties = [
    {
      id: 1,
      title: "وکیل ثبت احوال",
    },
    {
      id: 2,
      title: "وکیل بیمه",
    },
    {
      id: 3,
      title: "وکیل ملکی",
    },
    {
      id: 4,
      title: "وکیل مالیات",
    },
    {
      id: 5,
      title: "وکیل شرکت ها",
    },
    {
      id: 6,
      title: "وکیل انحصار وراثت",
    },
    {
      id: 7,
      title: "وکیل دیوان عدالت اداری",
    },
    {
      id: 8,
      title: "وکیل خانواده",
    },
    {
      id: 9,
      title: "وکیل وصول مطالبات",
    },
    {
      id: 10,
      title: "وکیل قراردادها",
    },
    {
      id: 11,
      title: "وکیل جرایم اینترنتی",
    },
    {
      id: 12,
      title: "وکیل اداره کار",
    },
    {
      id: 13,
      title: "وکیل بین الملل",
    },
    {
      id: 14,
      title: "وکیل مالکیت معنوی",
    },
    {
      id: 15,
      title: "وکیل کیفری (جرایم)",
    },
    {
      id: 16,
      title: "وکیل اجرای احکام",
    },
    {
      id: 17,
      title: "وکیل جرایم علیه اشخاص",
    },
    {
      id: 18,
      title: "وکیل جرایم علیه اموال",
    },
    {
      id: 19,
      title: "وکیل جرایم علیه امنیت کشور",
    },
    {
      id: 20,
      title: "وکیل اموال و مالکیت",
    },
    {
      id: 21,
      title: "وکیل ثبت اسناد",
    },
    {
      id: 22,
      title: "وکیل داوری",
    },
    {
      id: 23,
      title: "وکیل سربازی و نظام وظیفه",
    },
  ];
  return {
    visitTypes,
    genders,
    lawyerTypes,
    lawyerSpecialties,
  };
}
