import React from 'react'
import {HStack,Avatar,Text} from  "@chakra-ui/react"

const Message = ({text,uri,user="other"}) => {
  return (
    <HStack alignSelf={user==="me"? "flex-end" :"flex-start"} borderRadius={"base"} bg={"blue.100"} padding={"5px"}>
        {
            user==="other" && <Avatar src={uri} width={"35px"} height={"38px"} />
        }
        <Text>{text}</Text>
        {
            user==="me" && <Avatar src={uri} width={"35px"} height={"38px"}  />
        }
    </HStack>
  )
}

export default Message
