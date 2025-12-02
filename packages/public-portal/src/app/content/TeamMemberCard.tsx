import Image from 'next/image'

type Props = {
  name: string
  title: string
  image: string
  bio: string
}

export default function TeamMemberCard({ name, title, image, bio }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center max-w-xs mx-auto">
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-sm mb-4">
        <Image
          src={image}
          alt={name}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-[#500f0f]">{name}</h3>
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-sm text-gray-700">{bio}</p>
    </div>
  )
}
