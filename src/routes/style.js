import style from "styled-components";

export const LoginFormStyle = style.div`
display: flex;
gap: 1rem;
flex-direction:column;

.amplify-input{
    border-radius:40px;
    color: #808191;
}
.amplify-label{
    display:none;
}
.amplify-button[data-variation=primary] {
    display: flex;
    margin: 2rem 0;
    justify-content: center;
    background:#2aa275;
    border-radius:40px;
}
  }
 
`;

export const AuthWrapper = style.div`
position: relative;
`;
export const TextWrapper = style.p`
   font-size:28px;
`;

export const SubTextWrapper = style.p`
   font-size:14px;
   color:#7b7f9b;
   .forgot-password {
    margin: -164px 0;
    position: absolute;
    right: 20px;
}
`;
export const SubButtonWrapper = style.p`
 
    margin: -164px 0;
    position: absolute;
    right: 20px;
    .amplify-button:focus{
        box-shaddow:none;
        background:transparent;
    }

`;